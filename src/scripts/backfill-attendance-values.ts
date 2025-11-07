import 'dotenv/config';
import { getHealthyDbInstances, retryDatabaseOperation } from '../firebase-config';
import type { firestore } from 'firebase-admin';
import { AttendanceModel, DailyAttendance } from '../models/attendance';
import { randomUUID } from 'crypto';

const MONTHS: AttendanceModel['month'][] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function getCurrentMonthName(): AttendanceModel['month'] {
    const idx = new Date().getUTCMonth();
    return MONTHS[idx] as AttendanceModel['month'];
}

function getDaysInMonth(year: number, monthName: AttendanceModel['month']): number {
    const monthIndex = MONTHS.indexOf(monthName);
    if (monthIndex === -1) {
        // Fallback: default to 31 days if month is invalid
        return 31;
    }
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function makeEmptyDaily(dayNumber: number, isoTimestamp: string): DailyAttendance {
    return {
        id: randomUUID(),
        day: dayNumber,
        value: null,
        timestamp: isoTimestamp,
        from: null,
        to: null,
        status: 'N/A',
        dailyWorkedHours: 0,
        workedHours: []
    };
}

function normalizeAttendanceValues(raw: unknown, year: number, monthName: AttendanceModel['month']): DailyAttendance[] {
    if (Array.isArray(raw)) {
        // Already an array; return shallow copy to ensure we can mutate safely
        const a = raw as DailyAttendance[];
        return [...a];
    }

    const nowIso = new Date().toISOString();
    const days = getDaysInMonth(year, monthName);
    const arr: DailyAttendance[] = new Array(days);

    if (raw && typeof raw === 'object') {
        const entries = Object.entries(raw as Record<string, unknown>);
        for (const [k, v] of entries) {
            const idx = parseInt(k, 10);
            if (!Number.isNaN(idx) && idx >= 0 && idx < days) {
                arr[idx] = v as DailyAttendance;
            }
        }
    }

    // Fill any undefined slots with empty daily placeholders (Firestore arrays must be contiguous; no undefined)
    for (let i = 0; i < days; i++) {
        if (!arr[i]) {
            arr[i] = makeEmptyDaily(i + 1, nowIso);
        }
    }

    return arr;
}

type Scope = 'current' | 'year' | 'all';

async function backfill(scope: Scope, targetYear?: number): Promise<void> {
    const dbs = await getHealthyDbInstances();
    let totalChecked = 0;
    let totalUpdated = 0;
    const nowIso = new Date().toISOString();
    const currentYear = new Date().getUTCFullYear();
    const currentMonthName = getCurrentMonthName();
    // const dryRun = process.env.BACKFILL_DRY_RUN !== 'false';

    for (const [projectName, db] of Object.entries(dbs)) {
        console.log(`Scanning project: ${projectName}`);
        let query: firestore.Query = db.collection('attendance');

        if (scope === 'current') {
            query = query
                .where('year', '==', currentYear)
                .where('month', '==', currentMonthName);
        } else if (scope === 'year') {
            const yr = targetYear ?? currentYear;
            query = query.where('year', '==', yr);
        } // scope === 'all' leaves the base query unchanged

        const snapshot = await retryDatabaseOperation(async () => query.get(), 2, 1000, projectName);
        console.log(` - Found ${snapshot.size} attendance docs`);

        let projectUpdated = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data() as unknown as AttendanceModel & { values: unknown };
            totalChecked++;

            const values = (data as unknown as { values: unknown }).values;
            if (Array.isArray(values)) {
                continue;
            }

            // Convert map-like object to proper array and ensure contiguous entries
            const newValues = normalizeAttendanceValues(values, data.year, data.month);

            // if (dryRun) {
            //     console.log(`   [DRY-RUN] Would update ${projectName}/attendance/${doc.id} (map -> array length ${newValues.length})`);
            //     continue;
            // }

            await retryDatabaseOperation(async () => {
                return doc.ref.update({
                    values: newValues,
                    lastChanged: nowIso
                });
            }, 2, 1000, projectName);

            projectUpdated++;
            totalUpdated++;
        }

        console.log(` - Updated ${projectUpdated} docs in ${projectName}`);
    }

    console.log(`Backfill completed. Checked: ${totalChecked}, Updated: ${totalUpdated}`);
}

async function main(): Promise<void> {
    const scopeEnv = (process.env.BACKFILL_SCOPE || 'current').toLowerCase();
    const scope: Scope = scopeEnv === 'all' ? 'all' : scopeEnv === 'year' ? 'year' : 'current';
    const targetYear = process.env.BACKFILL_YEAR ? parseInt(process.env.BACKFILL_YEAR, 10) : undefined;

    console.log(`Starting attendance values backfill with scope="${scope}"${scope === 'year' ? ` for year ${targetYear ?? new Date().getUTCFullYear()}` : ''}.`);
    await backfill(scope, targetYear);
}

main()
    .then(() => {
        console.log('Done.');
    })
    .catch((err) => {
        console.error('Backfill failed:', err);
        process.exitCode = 1;
    });