export interface OvertimeRequestModel {
    id: string;
    timestamp: string;
    overtimeId: string;
    overtimeDate: string;
    overtimeStartTime: string;
    overtimeEndTime: string;
    duration:number; //hours
    overtimeType: string;
    employeeUids: string[];
    overtimeGoal: string;
    overtimeJustification: string;
    status: "pending" | "approved" | "rejected";
    requestedBy: string; //manager employee's uid
    reviewedDate: string | null;
    reviewedBy: string | null;
    hrComments: string | null;
}
