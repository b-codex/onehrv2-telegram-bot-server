export interface PerformanceEvaluationModel {
    id: string;
    employeeUid: string; //employee uid
    stage: "Incoming" | "Open" | "Closed";
    campaignID: string; //firebase id of campaign
    comment: string | null;
    confirmationStatus: "Not Confirmed" | "Accepted" | "Refused" | "N/A";
    periodID: string;
    roundID: string;
};