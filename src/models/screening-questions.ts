export default interface ScreeningQuestionModel {
    id: string;
    timestamp: string;
    name: string;
    active: boolean;
    passingScore: number;
    timerEnabled: boolean;
    timer: number;
    multipleChoiceQuestions: {
        id: string;
        title: string;
        weight: number;
    }[];
    shortAnswerQuestions: {
        id: string;
        title: string;
        weight: number;
        gradingSeverity: number;
    }[];
}