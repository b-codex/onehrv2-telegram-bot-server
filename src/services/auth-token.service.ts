import admin from 'firebase-admin';
import { firebaseConfigs } from '../firebase-config';
import { getFirebaseProjectConfig } from '../config/firebase-projects.config';

// Firebase client SDK configuration interface
export interface FirebaseClientConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
}

// Authentication token data structure
export interface AuthTokenData {
    customToken: string;
    projectId: string;
    firebaseConfig: FirebaseClientConfig;
    expiresAt: number;
}

// Employee data with UID for token generation
export interface EmployeeWithUID {
    id: string;
    uid: string;
    personalPhoneNumber: string;
    [key: string]: unknown;
}

/**
 * Generate Firebase custom token for employee authentication
 * @param uid - Employee's Firebase Auth UID
 * @param projectName - Firebase project name (e.g., 'development', 'dev')
 * @param phoneNumber - Employee's phone number (for logging)
 * @returns Promise<AuthTokenData> - Token data with Firebase config
 */
export async function generateEmployeeAuthToken(
    uid: string,
    projectName: string,
    phoneNumber: string
): Promise<AuthTokenData> {
    try {
        console.log(`🔑 Generating auth token for employee ${uid} in project ${projectName}`);

        // Validate inputs
        if (!uid || !projectName || !phoneNumber) {
            throw new Error('Missing required parameters: uid, projectName, or phoneNumber');
        }

        // Check if project exists
        const projectConfig = firebaseConfigs[projectName];
        if (!projectConfig) {
            throw new Error(`Firebase project '${projectName}' not found in configuration`);
        }

        // Get Firebase Admin app for this project
        const adminApp = admin.app(`app-${projectName}`);
        if (!adminApp) {
            throw new Error(`Firebase Admin app for project '${projectName}' not initialized`);
        }

        // Generate custom token with 5-minute expiration
        const expiresIn = 5 * 60; // 5 minutes in seconds
        const customToken = await admin.auth(adminApp).createCustomToken(uid, {
            phoneNumber: phoneNumber,
            projectId: projectConfig.projectId,
        });

        // Get Firebase client configuration for this project
        const firebaseConfig = getFirebaseClientConfig(projectName);

        const authData: AuthTokenData = {
            customToken,
            projectId: projectConfig.projectId,
            firebaseConfig,
            expiresAt: Date.now() + (expiresIn * 1000)
        };

        console.log(`✅ Generated auth token for employee ${uid} in project ${projectName}`);
        return authData;

    } catch (error) {
        console.error(`❌ Failed to generate auth token for employee ${uid}:`, error);
        throw error;
    }
}

/**
 * Get Firebase client SDK configuration for a specific project
 * @param projectName - Firebase project name
 * @returns FirebaseClientConfig - Client configuration object
 */
function getFirebaseClientConfig(projectName: string): FirebaseClientConfig {
    // Use the centralized project configuration
    return getFirebaseProjectConfig(projectName);
}

/**
 * Validate if a custom token is still valid (not expired)
 * @param authData - Authentication token data
 * @returns boolean - True if token is still valid
 */
export function isTokenValid(authData: AuthTokenData): boolean {
    return Date.now() < authData.expiresAt;
}

/**
 * Get all available Firebase project names
 * @returns string[] - Array of project names
 */
export function getAvailableProjects(): string[] {
    return Object.keys(firebaseConfigs);
}