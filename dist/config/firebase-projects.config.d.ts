export interface FirebaseProjectConfig {
    projectId: string;
    apiKey: string;
    authDomain: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
}
export declare const firebaseProjectConfigs: Record<string, FirebaseProjectConfig>;
export declare function getFirebaseProjectConfig(projectName: string): FirebaseProjectConfig;
export declare function getAvailableProjectNames(): string[];
export declare function hasProjectConfig(projectName: string): boolean;
//# sourceMappingURL=firebase-projects.config.d.ts.map