export interface SignatureModel {
    id: string;
    timestamp: string;
    name: string;
    image: string;
    startDate: string;
    endDate: string;
    active: "Yes" | "No";
}