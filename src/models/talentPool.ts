export interface TalentPoolModel {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
    levelOfEducation: string;
    yearsOfExperience: string;
    // step 2
    cvDocument: {
        id: string;
        name: string;
        type: "CV";
        url: string;
        uploadedAt: string;
    } | null;
}


