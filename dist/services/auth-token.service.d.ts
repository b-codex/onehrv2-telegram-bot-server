export interface FirebaseClientConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
}
export interface AuthTokenData {
    customToken: string;
    projectId: string;
    firebaseConfig: FirebaseClientConfig;
    expiresAt: number;
}
export interface EmployeeWithUID {
    id: string;
    uid: string;
    personalPhoneNumber: string;
    [key: string]: unknown;
}
export declare function generateEmployeeAuthToken(uid: string, projectName: string, phoneNumber: string): Promise<AuthTokenData>;
export declare function isTokenValid(authData: AuthTokenData): boolean;
export declare function getAvailableProjects(): string[];
//# sourceMappingURL=auth-token.service.d.ts.map