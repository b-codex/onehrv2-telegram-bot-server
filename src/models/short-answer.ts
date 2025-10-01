export interface ShortAnswerQuestion {
    id: string;
    question: string;
    wordLimit: number;
}

export default interface ShortAnswerModel {
    id: string;
    timestamp: string;
    name: string;
    questions: ShortAnswerQuestion[];
    active: boolean;
}
