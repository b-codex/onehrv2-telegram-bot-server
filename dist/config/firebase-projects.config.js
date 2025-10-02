"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseProjectConfigs = void 0;
exports.getFirebaseProjectConfig = getFirebaseProjectConfig;
exports.getAvailableProjectNames = getAvailableProjectNames;
exports.hasProjectConfig = hasProjectConfig;
exports.firebaseProjectConfigs = {
    development: {
        projectId: 'your-development-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEVELOPMENT || 'your-dev-api-key',
        authDomain: 'your-development-project-id.firebaseapp.com',
        storageBucket: 'your-development-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEVELOPMENT || 'your-dev-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEVELOPMENT || 'your-dev-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEVELOPMENT || 'your-dev-measurement-id'
    },
    dev: {
        projectId: 'your-dev-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV || 'your-dev-api-key',
        authDomain: 'your-dev-project-id.firebaseapp.com',
        storageBucket: 'your-dev-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV || 'your-dev-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV || 'your-dev-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEV || 'your-dev-measurement-id'
    },
    int: {
        projectId: 'your-integration-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_INT || 'your-int-api-key',
        authDomain: 'your-integration-project-id.firebaseapp.com',
        storageBucket: 'your-integration-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_INT || 'your-int-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_INT || 'your-int-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_INT || 'your-int-measurement-id'
    },
    validation: {
        projectId: 'your-validation-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_VALIDATION || 'your-val-api-key',
        authDomain: 'your-validation-project-id.firebaseapp.com',
        storageBucket: 'your-validation-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_VALIDATION || 'your-val-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_VALIDATION || 'your-val-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_VALIDATION || 'your-val-measurement-id'
    },
    cargolink_dev: {
        projectId: 'your-cargolink-dev-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_CARGOLINK_DEV || 'your-cargolink-dev-api-key',
        authDomain: 'your-cargolink-dev-project-id.firebaseapp.com',
        storageBucket: 'your-cargolink-dev-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_CARGOLINK_DEV || 'your-cargolink-dev-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_CARGOLINK_DEV || 'your-cargolink-dev-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_CARGOLINK_DEV || 'your-cargolink-dev-measurement-id'
    },
    cargolink_int: {
        projectId: 'your-cargolink-int-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_CARGOLINK_INT || 'your-cargolink-int-api-key',
        authDomain: 'your-cargolink-int-project-id.firebaseapp.com',
        storageBucket: 'your-cargolink-int-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_CARGOLINK_INT || 'your-cargolink-int-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_CARGOLINK_INT || 'your-cargolink-int-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_CARGOLINK_INT || 'your-cargolink-int-measurement-id'
    },
    cargolink_val: {
        projectId: 'your-cargolink-val-project-id',
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_CARGOLINK_VAL || 'your-cargolink-val-api-key',
        authDomain: 'your-cargolink-val-project-id.firebaseapp.com',
        storageBucket: 'your-cargolink-val-project-id.appspot.com',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_CARGOLINK_VAL || 'your-cargolink-val-messaging-sender-id',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_CARGOLINK_VAL || 'your-cargolink-val-app-id',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_CARGOLINK_VAL || 'your-cargolink-val-measurement-id'
    }
};
function getFirebaseProjectConfig(projectName) {
    const config = exports.firebaseProjectConfigs[projectName];
    if (!config) {
        throw new Error(`Firebase project configuration not found for project: ${projectName}`);
    }
    return config;
}
function getAvailableProjectNames() {
    return Object.keys(exports.firebaseProjectConfigs);
}
function hasProjectConfig(projectName) {
    return projectName in exports.firebaseProjectConfigs;
}
