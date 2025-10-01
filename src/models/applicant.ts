export default interface ApplicantModel {
    id: string;
    firstName: string;
    surname: string;
    birthdate: string;
    birthplace: string | null;
    gender: "Male" | "Female";
    levelOfEducation: string;
    yearsOfExperience: string;
    email: string;
    isEmailVerified: boolean;
    emailVerificationSentAt: string | null;
    phoneCountryCode: string;
    phoneNumber: string;
    faydaNumber: string | null;
    tinNumber: string | null;
    status: ApplicantStatus;
    suspendedUntil: string | null;
    actions: {
        action: ApplicantStatus;
        reason: string;
        timestamp: string;
    }[];

    // step 2
    cvDocument: {
        id: string;
        name: string;
        type: "CV";
        url: string;
        uploadedAt: string;
    } | null;
    workExperienceSummary: string | null;
    desiredPosition: string | null;
    expectedSalary: string | null;
    professionalExperiences: ProfessionalExperience[];
    educationExperiences: EducationExperience[];
    jobPreferences: JobPreference[];
    skills: string[];
    languages: LanguageProficiency[];
    certifications: string[];
    photo: string | null;
    savedJobs: string[];
    profile_share_token?: string;
    registeredAt: string;
    industry: string[];
    category: string[];

    telegramUserId: string | null;
}

export enum ApplicantStatus {
    Active = "Active",
    Inactive = "Inactive",
    Pending = "Pending",
    Suspended = "Suspended",
    Flagged = "Flagged",
    Deactivated = "Deactivated",
    Deleted = "Deleted",
}

export interface LanguageProficiency {
    language: string;
    proficiency: string;
}

export interface ProfessionalExperience {
    id: string;
    companyName: string;
    title: string;
    startDate: string;
    endDate: string | null;
    currentlyWorking: boolean;
    mainActivities: string;
    reference: string;
}

export interface EducationExperience {
    id: string;
    startDate: string;
    endDate: string | null;
    currentlyStudying: boolean;
    educationLevel: string;
    title: string;
    school: string;
}

// interface for the applicant's job preferences
export interface JobPreference {
    id: string;
    name: string;
    industries: string[];
    Category: string[];
    jobRoles: string[];
    locations: string[];
    salaryRange: {
        min: number;
        max: number;
        currency: string;
        period: "annual" | "monthly" | "hourly";
    };
    salaryType: string[];
    contractTypes: string[];
    workModes: string[];
    companySizes: string[];
    jobLevels: string[];
    isActive: boolean;
    alertsEnabled: boolean;
    updatedAt: string;
}
