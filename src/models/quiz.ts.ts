export interface QuizModel {
    id: string,
    createdBy: string,
    creationDate: string,
    quizTitle: string,
    audienceTarget: string[],
    employees: string[];
    departments: string[];
    sections: string[];
    locations: string[];
    grades: string[];
    selected: string[],
    startDate: string,
    endDate: string,
    active: "Yes" | "No";
    passingRate: number,
    questionTimerEnabled: boolean,
    timer: number,
    multipleChoice: string[] | null,
    shortAnswer: {
        id: string,
        value: string
    }[] | null,

    quizTakenTimestamp: QuizTakenTimestampModel[] | null
    quizAnswers: QuizAnswerModel[];
}

export interface QuizAnswerModel {
    questionId: string;
    employeeUid: string;
    questionType: 'multiple-choice' | 'short-answer';
    answer: string | number;
    answerScore: number; // 1-100 for short answers. And 0 or 100 for mcq.
}

export interface QuizTakenTimestampModel {
    employeeUid: string,
    timestamp: string,
    timeRemaining: number; //seconds
    score: number;  // out of 100%
}