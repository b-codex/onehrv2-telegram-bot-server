export interface CompetenceValueModel {
    id: string
    campaignId: string
    employeeUid: string
    competenceId: string
    threshold: number
    weight: number | null
    value: number | null // evaluation given by the manager or employee
    evidenceFile: string | null;
    evidenceLink: string | null;
    employeeComment: string | null;
    managerComment: string|null;
}

export interface AssessmentModel {
    campaignId: string;
    evaluatedBy: string; //manager or employee uid
    competenceValues: CompetenceValueModel[]
}

export interface CompetenceAssessmentModel {
    id: string;
    timestamp: string;
    for: string;
    assessment: AssessmentModel[]
}
