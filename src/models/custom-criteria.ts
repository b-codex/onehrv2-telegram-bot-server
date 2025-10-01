export default interface CustomCriteriaModel {
    id: string;
    timestamp: string;
    name: string;
    criteria: CustomCriteriaItem[];
}


export interface CustomCriteriaItem {
    id: string;
    name: string;
    type: "select" | "number" | "text" | "multi-line text";
    options: string[]; // Only used for 'select' type
    required: boolean;
}
