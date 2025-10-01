export interface ObjectiveWeightModel {
    id: string;
    timestamp: string;
    campaignId:string;
    objectiveWeights: WeightModel[];
}

export interface WeightModel {
    objectiveId: string; // Objective id
    weight: number | null; // 0 - 100
    employeeUid: string;
}