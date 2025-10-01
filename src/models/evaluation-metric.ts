export interface EvaluationMetricItem {
    id: string;
    name: string;
    threshold: number;
    weight: number;
}

export interface EvaluationMetricModel {
    id: string;
    name: string;
    passingScore: number;
    isActive: boolean;
    metrics: EvaluationMetricItem[];
    timestamp: string;
}