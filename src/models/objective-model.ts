export type EmployeeCreatedObjectiveStatus = "Created" | "Approved" | "Refused"
export type ManagerCreatedObjectiveStatus = "Created" | "Acknowledged"

export interface ObjectiveModel {
    timestamp: string
    id: string
    createdBy: string
    state: string
    title: string
    deptKPI: string | null
    unitKPI: string[] | null
    SMARTObjective: string
    targetDate: string
    employee: string

    period: string // this periodID
    round: string //this roundID
    employeeFeedback: string[]
    managerFeedback: string[]
    status: EmployeeCreatedObjectiveStatus | ManagerCreatedObjectiveStatus

    approved: boolean // used to determine whether the includeInScore calculation is approved
    justification: string | null
    selfEvaluation: SelfEvaluationModel | null
    managerEvaluation: ManagerEvaluationModel | null
    actionItems: { timestamp: string; id: string; actionItem: string; employee: boolean; manager: boolean }[]
}

export interface ObjectiveModelWithWeight extends ObjectiveModel {
    weight: number | null
}

export interface SelfEvaluationModel {
    value: number // (1-5) employee self-assessment rating
    actualResult: string
    justification: string | null
    evidenceFile: string | null
}

export interface ManagerEvaluationModel {
    value: number | null // (1-5) manager assessment rating, allow null for older data
    justification: string | null
    managerMessage: string | null
    timestamp: string | null
}