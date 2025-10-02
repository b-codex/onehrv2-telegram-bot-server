"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmployeeAuthToken = generateEmployeeAuthToken;
exports.isTokenValid = isTokenValid;
exports.getAvailableProjects = getAvailableProjects;
const tslib_1 = require("tslib");
const firebase_admin_1 = tslib_1.__importDefault(require("firebase-admin"));
const firebase_config_1 = require("../firebase-config");
const firebase_projects_config_1 = require("../config/firebase-projects.config");
async function generateEmployeeAuthToken(uid, projectName, phoneNumber) {
    try {
        console.log(`🔑 Generating auth token for employee ${uid} in project ${projectName}`);
        if (!uid || !projectName || !phoneNumber) {
            throw new Error('Missing required parameters: uid, projectName, or phoneNumber');
        }
        const projectConfig = firebase_config_1.firebaseConfigs[projectName];
        if (!projectConfig) {
            throw new Error(`Firebase project '${projectName}' not found in configuration`);
        }
        const adminApp = firebase_admin_1.default.app(`app-${projectName}`);
        if (!adminApp) {
            throw new Error(`Firebase Admin app for project '${projectName}' not initialized`);
        }
        const expiresIn = 5 * 60;
        const customToken = await firebase_admin_1.default.auth(adminApp).createCustomToken(uid, {
            phoneNumber: phoneNumber,
            projectId: projectConfig.projectId,
        });
        const firebaseConfig = getFirebaseClientConfig(projectName);
        const authData = {
            customToken,
            projectId: projectConfig.projectId,
            firebaseConfig,
            expiresAt: Date.now() + (expiresIn * 1000)
        };
        console.log(`✅ Generated auth token for employee ${uid} in project ${projectName}`);
        return authData;
    }
    catch (error) {
        console.error(`❌ Failed to generate auth token for employee ${uid}:`, error);
        throw error;
    }
}
function getFirebaseClientConfig(projectName) {
    return (0, firebase_projects_config_1.getFirebaseProjectConfig)(projectName);
}
function isTokenValid(authData) {
    return Date.now() < authData.expiresAt;
}
function getAvailableProjects() {
    return Object.keys(firebase_config_1.firebaseConfigs);
}
