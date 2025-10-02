"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfigs = exports.dbInstances = exports.dbPerformanceMonitor = exports.employeeCache = void 0;
exports.checkDatabaseHealth = checkDatabaseHealth;
exports.getHealthyDbInstances = getHealthyDbInstances;
exports.retryDatabaseOperation = retryDatabaseOperation;
const tslib_1 = require("tslib");
const firebase_admin_1 = tslib_1.__importDefault(require("firebase-admin"));
const prefixes = ['DEVELOPMENT', 'DEV', 'INT', 'VALIDATION', 'CARGOLINK_DEV', 'CARGOLINK_INT', 'CARGOLINK_VAL'];
const dbInstances = {};
exports.dbInstances = dbInstances;
const firebaseConfigs = {};
exports.firebaseConfigs = firebaseConfigs;
prefixes.forEach(prefix => {
    const envVar = `NEXT_PUBLIC_FIREBASE_ADMIN_${prefix}`;
    if (process.env[envVar]) {
        const config = JSON.parse(process.env[envVar]);
        const name = prefix.toLowerCase();
        const appName = `app-${name}`;
        firebaseConfigs[name] = {
            projectId: config.project_id,
            config,
            name
        };
        if (firebase_admin_1.default) {
            let app;
            if (firebase_admin_1.default.apps.some(existingApp => existingApp !== null && existingApp.name === appName)) {
                app = firebase_admin_1.default.app(appName);
            }
            else {
                app = firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(config)
                }, appName);
            }
            const firestoreDb = firebase_admin_1.default.firestore(app);
            dbInstances[name] = firestoreDb;
        }
    }
});
async function checkDatabaseHealth(db, projectName) {
    const startTime = Date.now();
    try {
        const testQuery = db.collection('_health_check').limit(1);
        await testQuery.get();
        const duration = Date.now() - startTime;
        console.log(`Database ${projectName} health check: OK (${duration}ms)`);
        exports.dbPerformanceMonitor.recordQuery(projectName, duration, true);
        return true;
    }
    catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`Database ${projectName} health check failed: ${errorMessage} (${duration}ms)`);
        exports.dbPerformanceMonitor.recordQuery(projectName, duration, false, errorMessage);
        return false;
    }
}
async function getHealthyDbInstances() {
    console.log(`Checking database health for ${Object.keys(dbInstances).length} instances...`);
    const healthyInstances = {};
    for (const [projectName, db] of Object.entries(dbInstances)) {
        console.log(`Checking health for project: ${projectName}`);
        if (await checkDatabaseHealth(db, projectName)) {
            healthyInstances[projectName] = db;
            console.log(`✅ Project ${projectName} is healthy`);
        }
        else {
            console.log(`❌ Project ${projectName} is not healthy`);
        }
    }
    console.log(`Found ${Object.keys(healthyInstances).length} healthy database instances`);
    return healthyInstances;
}
class EmployeeCache {
    constructor() {
        this.cache = new Map();
        this.TTL = 5 * 60 * 1000;
    }
    set(phoneNumber, data, projectName) {
        this.cache.set(phoneNumber, {
            data,
            timestamp: Date.now(),
            projectName
        });
    }
    get(phoneNumber) {
        const entry = this.cache.get(phoneNumber);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(phoneNumber);
            return null;
        }
        return { data: entry.data, projectName: entry.projectName };
    }
    clear() {
        this.cache.clear();
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > this.TTL) {
                this.cache.delete(key);
            }
        }
    }
}
exports.employeeCache = new EmployeeCache();
class DatabasePerformanceMonitor {
    constructor() {
        this.metrics = [];
        this.maxMetrics = 1000;
    }
    recordQuery(projectName, duration, success, error) {
        const metric = {
            projectName,
            duration,
            success,
            timestamp: Date.now()
        };
        if (error !== undefined) {
            metric.error = error;
        }
        this.metrics.push(metric);
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
        if (duration > 3000) {
            console.warn(`Slow database query detected: ${projectName} took ${duration}ms`);
        }
    }
    getMetrics() {
        return [...this.metrics];
    }
    getAverageQueryTime(projectName) {
        const relevantMetrics = projectName
            ? this.metrics.filter(m => m.projectName === projectName && m.success)
            : this.metrics.filter(m => m.success);
        if (relevantMetrics.length === 0)
            return 0;
        const totalTime = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
        return totalTime / relevantMetrics.length;
    }
    getSlowQueries(threshold = 3000) {
        return this.metrics.filter(m => m.duration > threshold);
    }
    getErrorRate(projectName) {
        const relevantMetrics = projectName
            ? this.metrics.filter(m => m.projectName === projectName)
            : this.metrics;
        if (relevantMetrics.length === 0)
            return 0;
        const errorCount = relevantMetrics.filter(m => !m.success).length;
        return (errorCount / relevantMetrics.length) * 100;
    }
}
async function retryDatabaseOperation(operation, maxRetries = 3, baseDelay = 1000, projectName) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const startTime = Date.now();
            const result = await operation();
            const duration = Date.now() - startTime;
            if (projectName) {
                exports.dbPerformanceMonitor.recordQuery(projectName, duration, true);
            }
            return result;
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            if (projectName) {
                exports.dbPerformanceMonitor.recordQuery(projectName, 0, false, lastError.message);
            }
            if (lastError.message.includes('permission-denied') ||
                lastError.message.includes('not-found') ||
                lastError.message.includes('already-exists')) {
                throw lastError;
            }
            if (attempt === maxRetries) {
                throw lastError;
            }
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, lastError.message);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
exports.dbPerformanceMonitor = new DatabasePerformanceMonitor();
