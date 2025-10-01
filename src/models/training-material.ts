
export interface TrainingMaterialModel {
    id: string;
    createdBy: string;
    timestamp: string;
    name: string;
    category: string[];
    format: 'Audio' | 'Video' | 'PDF'
    isDownloadable: boolean;
    url: string;
    isExternalLink: boolean;
    length: string;
    complexity: string;
    startDate: string;
    endDate: string;
    publishState: boolean;
    audienceTarget: string[];
    employees: string[];
    departments: string[];
    sections: string[];
    locations: string[];
    grades: string[];
    requirementLevel: "Mandatory" | "Optional";
    targetedCompetencies: string[];
    relatedPositions: string[];
    outputValue: string;
    associatedQuiz: string[];
    attachments: attachmentModel[];
    relatedTrainingMaterialRequest: string | null;
    certificationTitle: string;
    availability: number;
    employeeFeedbacks: FeedbackModel[];
    medium: "Virtual" | "Physical";
    trainingCost: "Free" | "Paid";
    trainingOutcome: string[];
    trainingJustification?: string;
    status: "N/A" | "In Progress" | "Completed";
    approvalStatus: "Approved" | "Rejected" | "Refused" | "Awaiting Manager Approval" | "Awaiting HR Approval";
    assignedEmployees: string[];
    sentSurveyIDs: string[];
}

export type TrainingMaterialRequestModel = TrainingMaterialModel

export interface attachmentModel {
    attachmentTitle: string;
    attachmentFormat: string;
    attachmentUrl: string
}

export interface FeedbackModel {
    employeeUid: string;
    rating: number;
    comment: string;
}