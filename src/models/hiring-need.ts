export interface HiringNeedModel {
    id: string | null;
    hiringNeedID: string;
    timestamp: string;
    hiringNeedType: string;
    hiringNeedStage: "Pending" | "Approved" | "Rejected";
    reasonForHire: string;
    jobTitle: string;
    startDate: string;
    levelOfEducation: string;
    yearsOfExperience: string;
    location: string;
    department: string;
    createdBy: string;
    rejectionReason: string | null;
}