import { getHealthyDbInstances, retryDatabaseOperation } from '../firebase-config';
import { validateEmployeeLocationAndArea } from '../util/locationValidation';
import { AttendanceModel, WorkedHoursModel } from '../models/attendance';
import { EmployeeModel } from '../models/employee';
import { getTimestamp } from '../util/dayjs_format';
import dayjs from 'dayjs';
import { sendMessage } from '../bot';
import getEmployeeFullName from '../util/getEmployeeFullName';

interface ClockedInEmployee {
    employee: EmployeeModel;
    attendance: AttendanceModel;
    projectName: string;
}

interface AutoClockOutResult {
    success: boolean;
    employeeId: string;
    employeeName: string;
    managerChatId?: string | null;
    error?: string | null;
}

export class LocationMonitoringService {
    private intervalId?: NodeJS.Timeout | null;
    private isRunning = false;

    // Configuration with validation
    // private readonly CHECK_INTERVAL_MINUTES = Math.max(1, Math.min(60, parseInt(process.env.LOCATION_CHECK_INTERVAL_MINUTES || '10')));
    // private readonly MAX_LOCATION_AGE_MINUTES = Math.max(5, Math.min(120, parseInt(process.env.LOCATION_MAX_AGE_MINUTES || '30')));
    // private readonly FEATURE_ENABLED = process.env.LOCATION_AUTO_CLOCK_OUT_ENABLED !== 'false';
    // private readonly NOTIFICATION_ENABLED = process.env.LOCATION_NOTIFICATIONS_ENABLED !== 'false';
    private readonly CHECK_INTERVAL_MINUTES = 30;
    private readonly MAX_LOCATION_AGE_MINUTES = 30;
    private readonly FEATURE_ENABLED = true;
    private readonly NOTIFICATION_ENABLED = true;

    startMonitoring(): void {
        if (this.isRunning) {
            console.log('Location monitoring already running');
            return;
        }

        if (!this.FEATURE_ENABLED) {
            console.log('Location auto clock-out feature is disabled');
            return;
        }

        console.log(`Starting location monitoring service (check every ${this.CHECK_INTERVAL_MINUTES} minutes, max location age: ${this.MAX_LOCATION_AGE_MINUTES} minutes, notifications: ${this.NOTIFICATION_ENABLED ? 'enabled' : 'disabled'})`);
        this.isRunning = true;

        // Run initial check after a short delay to allow system to stabilize
        setTimeout(() => {
            this.runLocationCheck();
        }, 30000); // 30 seconds delay

        // Schedule periodic checks
        this.intervalId = setInterval(() => {
            this.runLocationCheck();
        }, this.CHECK_INTERVAL_MINUTES * 60 * 1000);
    }

    stopMonitoring(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        console.log('Location monitoring service stopped');
    }

    isMonitoring(): boolean {
        return this.isRunning;
    }

    private async runLocationCheck(): Promise<void> {
        try {
            console.log('🔍 Running location monitoring check...');

            const clockedInEmployees = await this.findClockedInEmployees();

            if (clockedInEmployees.length === 0) {
                console.log('No employees currently clocked in');
                return;
            }

            console.log(`Found ${clockedInEmployees.length} clocked-in employees`);

            const autoClockOutResults: AutoClockOutResult[] = [];

            for (const { employee, attendance, projectName } of clockedInEmployees) {
                try {
                    const result = await this.checkAndAutoClockOut(employee, attendance, projectName);
                    if (result) {
                        autoClockOutResults.push(result);
                    }
                } catch (error) {
                    console.error(`Error checking employee ${employee.uid}:`, error);
                }
            }

            // Send notifications for successful auto clock-outs
            for (const result of autoClockOutResults) {
                await this.sendNotifications(result);
            }

            console.log(`Location monitoring check completed. Auto clocked out: ${autoClockOutResults.length} employees`);
        } catch (error) {
            console.error('Error in location monitoring check:', error);
        }
    }

    private async findClockedInEmployees(): Promise<ClockedInEmployee[]> {
        const healthyDbs = await getHealthyDbInstances();
        const clockedInEmployees: ClockedInEmployee[] = [];

        for (const [projectName, db] of Object.entries(healthyDbs)) {
            try {
                // Find attendance records with lastClockInTimestamp set (indicating currently clocked in)
                const attendanceRef = db.collection('attendance');
                const currentYear = dayjs.tz().year();
                const currentMonth = dayjs.tz().format('MMMM') as "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

                // Fetch all attendance records for current month and filter client-side
                // This avoids needing composite indexes on multiple fields across many databases
                const attendanceQuery = await retryDatabaseOperation(async () => {
                    return await attendanceRef
                        .where('year', '==', currentYear)
                        .where('month', '==', currentMonth)
                        .get();
                }, 2, 1000, projectName);

                // Filter client-side for currently clocked-in employees
                const clockedInDocs = attendanceQuery.docs.filter(doc => {
                    const data = doc.data();
                    return data.lastClockInTimestamp !== null && data.lastClockInTimestamp !== undefined;
                });

                for (const attendanceDoc of clockedInDocs) {
                    const attendance = attendanceDoc.data() as AttendanceModel;
                    attendance.id = attendanceDoc.id;

                    // Get employee data
                    const employeeRef = db.collection('employee').doc(attendance.uid);
                    const employeeDoc = await retryDatabaseOperation(async () => {
                        return await employeeRef.get();
                    }, 2, 1000, projectName);

                    if (employeeDoc.exists) {
                        const employee = employeeDoc.data() as EmployeeModel;
                        employee.id = employeeDoc.id;

                        clockedInEmployees.push({
                            employee,
                            attendance,
                            projectName
                        });
                    }
                }
            } catch (error) {
                console.error(`Error querying attendance in ${projectName}:`, error);
                continue;
            }
        }

        return clockedInEmployees;
    }

    private async checkAndAutoClockOut(
        employee: EmployeeModel,
        attendance: AttendanceModel,
        projectName: string
    ): Promise<AutoClockOutResult | null> {
        // Skip if employee has no working area defined
        if (!employee.workingArea || employee.workingArea.trim() === '') {
            console.log(`Skipping auto clock-out for ${employee.uid}: no working area defined`);
            return null;
        }

        // Validate location and working area
        const validation = validateEmployeeLocationAndArea(
            employee.currentLocation,
            employee.workingArea,
            this.MAX_LOCATION_AGE_MINUTES
        );

        if (validation.isValid) {
            // Employee is within working area, no action needed
            return null;
        }

        // Check if the error is specifically about being outside working area
        if (!validation.error?.includes('outside your designated working area')) {
            // Different validation error (no location, old location, invalid working area, etc.) - don't auto clock out
            console.log(`Skipping auto clock-out for ${employee.uid}: ${validation.error}`);
            return null;
        }

        // Check if employee was recently auto clocked out (prevent spam)
        const lastClockOut = attendance.values[dayjs.tz(attendance.lastClockInTimestamp).date() - 1]?.workedHours
            .filter(wh => wh.type === 'Clock Out')
            .sort((a, b) => dayjs.tz(b.timestamp).diff(dayjs.tz(a.timestamp)))[0];

        if (lastClockOut) {
            const minutesSinceLastClockOut = dayjs.tz().diff(dayjs.tz(lastClockOut.timestamp), 'minute');
            if (minutesSinceLastClockOut < this.CHECK_INTERVAL_MINUTES) {
                console.log(`Skipping auto clock-out for ${employee.uid}: recently clocked out (${minutesSinceLastClockOut} minutes ago)`);
                return null;
            }
        }

        // Employee is outside working area - perform auto clock-out
        console.log(`Auto clocking out employee ${employee.uid} - outside working area`);

        const clockOutResult = await this.performAutoClockOut(attendance, projectName);

        if (!clockOutResult.success) {
            return {
                success: false,
                employeeId: employee.uid,
                employeeName: getEmployeeFullName(employee),
                managerChatId: null,
                error: clockOutResult.error || null
            };
        }

        // Find manager's telegram chat ID
        let managerChatId: string | null = null;
        if (employee.reportingLineManager) {
            managerChatId = await this.findManagerChatId(employee.reportingLineManager, projectName) || null;
        }

        return {
            success: true,
            employeeId: employee.uid,
            employeeName: getEmployeeFullName(employee),
            managerChatId
        };
    }

    private async performAutoClockOut(attendance: AttendanceModel, projectName: string): Promise<{ success: boolean; error?: string }> {
        const db = (await getHealthyDbInstances())[projectName];
        if (!db) {
            return { success: false, error: 'Database not available' };
        }

        try {
            // Use the existing clockInOrOut logic but adapted for server-side
            const clockInDate = dayjs.tz(attendance.lastClockInTimestamp);
            const clockOutTimestamp = dayjs.tz().toISOString();
            const clockInDayIndex = clockInDate.date() - 1;

            // Calculate hours worked
            const hoursWorked = dayjs.tz().diff(dayjs.tz(attendance.lastClockInTimestamp), 'hours', true);

            // Get worked hours array
            const workedHours = attendance.values[clockInDayIndex]?.workedHours || [];

            // Add clock-out entry
            const clockOutEntry: WorkedHoursModel = {
                id: crypto.randomUUID(),
                timestamp: clockOutTimestamp,
                type: 'Clock Out',
                hour: dayjs.tz().format('h:mm A')
            };

            workedHours.push(clockOutEntry);

            // Update daily and monthly worked hours
            const dailyWorkedHours = (attendance.values[clockInDayIndex]?.dailyWorkedHours || 0) + hoursWorked;
            const monthlyWorkedHours = attendance.monthlyWorkedHours + hoursWorked;

            // Update attendance record
            const updateData = {
                values: {
                    ...attendance.values,
                    [clockInDayIndex]: {
                        ...attendance.values[clockInDayIndex],
                        workedHours,
                        dailyWorkedHours,
                        value: 'A', // Mark as absent due to auto clock-out
                        status: 'Submitted',
                        timestamp: clockOutTimestamp
                    }
                },
                monthlyWorkedHours,
                lastClockInTimestamp: null, // Clear clock-in timestamp
                lastChanged: getTimestamp()
            };

            await retryDatabaseOperation(async () => {
                return await db.collection('attendance').doc(attendance.id).update(updateData);
            }, 2, 1000, projectName);

            return { success: true };
        } catch (error) {
            console.error('Error performing auto clock-out:', error);
            return { success: false, error: 'Failed to update attendance record' };
        }
    }

    private async findManagerChatId(managerUid: string, projectName: string): Promise<string | undefined> {
        try {
            const db = (await getHealthyDbInstances())[projectName];
            if (!db) return undefined;

            const managerDoc = await retryDatabaseOperation(async () => {
                return await db.collection('employee').doc(managerUid).get();
            }, 2, 1000, projectName);

            if (managerDoc.exists) {
                const manager = managerDoc.data() as EmployeeModel;
                return manager.telegramChatID || undefined;
            }
        } catch (error) {
            console.error('Error finding manager chat ID:', error);
        }
        return undefined;
    }

    private async sendNotifications(result: AutoClockOutResult): Promise<void> {
        if (!this.NOTIFICATION_ENABLED) {
            return;
        }

        try {
            // Notify employee
            if (result.success) {
                // Find employee's telegram chat ID - we need to pass the correct project
                // For now, we'll search across all projects (inefficient but works)
                const employeeChatId = await this.findEmployeeChatIdAcrossProjects(result.employeeId);
                if (employeeChatId) {
                    await sendMessage(
                        parseInt(employeeChatId),
                        `⚠️ You have been automatically clocked out because you are outside your designated working area.`
                    );
                }
            }

            // Notify manager
            if (result.managerChatId) {
                await sendMessage(
                    parseInt(result.managerChatId),
                    `👤 Employee ${result.employeeName} has been automatically clocked out due to being outside the working area.`
                );
            }
        } catch (error) {
            console.error('Error sending notifications:', error);
        }
    }

    private async findEmployeeChatIdAcrossProjects(employeeUid: string): Promise<string | null> {
        const healthyDbs = await getHealthyDbInstances();
        for (const [projectName, db] of Object.entries(healthyDbs)) {
            try {
                const employeeDoc = await retryDatabaseOperation(async () => {
                    return await db.collection('employee').doc(employeeUid).get();
                }, 2, 1000, projectName);

                if (employeeDoc.exists) {
                    const employee = employeeDoc.data() as EmployeeModel;
                    if (employee.telegramChatID) {
                        return employee.telegramChatID;
                    }
                }
            } catch (error) {
                console.error(`Error finding employee chat ID in ${projectName}:`, error);
                continue;
            }
        }
        return null;
    }
}

// Export singleton instance
export const locationMonitoringService = new LocationMonitoringService();