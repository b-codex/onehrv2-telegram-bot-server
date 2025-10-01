import CustomCriteriaModel from "./custom-criteria";
import { EvaluatorModel } from "./job-post";
import ScreeningQuestionModel from "./screening-questions";

export interface JobApplicationModel {
    id: string;

    // fields that always exist
    appliedDate: string;
    applicantId: string;
    jobPostId: string;
    //   company: CompanyModel;
    status:
    | "Applied"
    | "Shortlisted"
    | "Interview"
    | "Interview-Rejected"
    | "Rejected"
    | "Offer"
    | "Withdrawn";

    // new field for applicant motivation
    motivation: string | null;

    // these fields only exist if a job post has a screening question associated
    screeningQuestionId: string | null;
    customCriteriaId: string | null;
    startedAt: string | null;
    submittedAt: string | null;
    timeLeftSeconds: number | null; // Time remaining when submitted
    timerEnabled: boolean | null;
    totalDuration: string | null;
    passingScore: number | null;
    finalScore: number | null;
    passed: boolean | null;
    sections: {
        multipleChoice: {
            score: number; // Actual score (0-100)
            weightedScore: number; // score * weight
            maxPossible: number;
            weight: number; // From screening (e.g., 70)
            questions: {
                id: string;
                modelId: string;
                questionText: string;
                selectedOptionIndex: number;
                correctOptionIndex: number;
                options: string[];
                isCorrect: boolean;
                pointsAwarded: number; // 1 if correct, 0 if not
            }[];
        };
        shortAnswer: {
            score: number;
            weightedScore: number;
            maxPossible: number;
            weight: number;
            questions: {
                id: string;
                modelId: string; // <--- ADD THIS LINE
                questionText: string;
                answerText: string;
                wordLimit: number;
                gradingSeverity: number;
                pointsAwarded: number;
            }[];
        };
    } | null;
    rawAnswers: Record<string, number | string> | null; // Original user answers
    screeningQuestion: ScreeningQuestionModel | null;
    customCriteria: CustomCriteriaModel | null;
    hiredDate: string | null;

    // evaluation
    evaluations: EvaluationData[];
    note: NoteModel[];

    // check to see if the pages are opened -- this prevents the applicant from leaving the page while the question list is open
    criteriaPageOpen: boolean;
    screeningPageOpen: boolean;

    // custom criteria answers
    customCriteriaRawAnswers: Record<string, number | string> | null; // Original user answers
    customCriteriaAnswers: Record<string, string> | null;
}

export interface NoteModel {
    id: string; // The document ID from Firestore
    content: string;
    author: {
        uid: string; // The ID of the user who wrote the note
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
    color: string;
    tags: string[];
}
export interface EvaluationMetricScore {
    name: string;
    description?: string;
    score: number;
    threshold: number;
    weight: number;
}

export interface EvaluationData {
    evaluator: EvaluatorModel;
    behaviorAssessment: string;
    technicalAssessment: string;
    generalComment: string;
    metrics: EvaluationMetricScore[];
    interviewDate: string;
    evaluationDate: string;
    status: "draft" | "submitted" | "archived";
    weightedScore: number;
    passedThreshold: boolean;
}
