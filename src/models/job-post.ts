
export interface JobPostModel {
    id: string;
    timestamp: string;
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    minSalary: string;
    maxSalary: string;
    salaryType: string;
    applicationDeadline: string;
    levelOfEducation: string;
    yearsOfExperience: string;
    /**
     * Job description content stored as JSON-stringified HTML
     * Use htmlToString() to convert HTML to this format for Firebase storage
     * Use stringToHtml() to convert back to HTML for display/editing
     * Supports backward compatibility with legacy plain text content
     */
    jobDescription: string;

    requirements: string[];
    responsibilities: string[];
    benefits: string[];

    contactEmail: string | null;
    contactPhone: string | null;
    contactName: string | null;

    useScreeningQuestions: boolean;
    selectedScreeningQuestion: string;

    useCustomCriteria: boolean;
    selectedCriteriaSet: string;

    status: "Draft" | "Announced" | "Withdrawn" | "Terminated";
    applicants: number;

    associatedEvaluationMetrics: string | null;
    evaluators: EvaluatorModel[];
    workMode: string;
    jobLevel: string;
    visibility: "Public" | "Private";
    matchingProfileId: string | null;
}

export interface EvaluatorModel {
    id: string;
    invitedAt: string;
    code: string;
    name: string;
    role: string | null;
    email: string;
    status: "Pending" | "Accepted" | "Declined";
}

export interface ScreeningAnswerModel {
    questionId: string;
    question: string;
    answer: string;
    questionType: "multiple-choice" | "short-answer";
}

export interface JobPostFormData {
    jobTitle: string;
    department: string;
    location: string;
    employmentType: string;
    status: "Draft" | "Announced" | "Withdrawn" | "Terminated";
    minSalary: string;
    maxSalary: string;
    salaryType: string;
    /**
     * Job description content stored as JSON-stringified HTML
     * Use htmlToString() to convert HTML to this format for Firebase storage
     * Use stringToHtml() to convert back to HTML for display/editing
     * Supports backward compatibility with legacy plain text content
     */
    jobDescription: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    applicationDeadline: string;
    visibility: "Public" | "Private";
    contactEmail: string;
    contactPhone: string;
    contactName: string;
    yearsOfExperience: string;
    workMode: string;
    levelOfEducation: string;
    jobLevel: string;
    useScreeningQuestions: boolean;
    selectedScreeningQuestion: string;
    useCustomCriteria: boolean;
    selectedCriteriaSet: string;
    associatedEvaluationMetrics: string | null;
    evaluators: EvaluatorModel[];
    matchingProfileId: string | null;
}