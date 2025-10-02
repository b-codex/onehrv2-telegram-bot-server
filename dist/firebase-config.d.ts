import type { ServiceAccount } from 'firebase-admin';
import type { firestore } from 'firebase-admin';
interface ExtendedServiceAccount extends ServiceAccount {
    [key: string]: any;
}
interface FirebaseConfig {
    projectId: string;
    config: ExtendedServiceAccount;
    name: string;
}
declare const dbInstances: Record<string, any>;
declare const firebaseConfigs: Record<string, FirebaseConfig>;
export declare function checkDatabaseHealth(db: firestore.Firestore, projectName: string): Promise<boolean>;
export declare function getHealthyDbInstances(): Promise<Record<string, firestore.Firestore>>;
declare class EmployeeCache {
    private cache;
    private readonly TTL;
    set(phoneNumber: string, data: {
        id: string;
        uid: string;
        [key: string]: unknown;
    }, projectName: string): void;
    get(phoneNumber: string): {
        data: {
            id: string;
            uid: string;
            [key: string]: unknown;
        };
        projectName: string;
    } | null;
    clear(): void;
    cleanup(): void;
}
export declare const employeeCache: EmployeeCache;
interface QueryMetrics {
    projectName: string;
    duration: number;
    success: boolean;
    timestamp: number;
    error?: string;
}
declare class DatabasePerformanceMonitor {
    private metrics;
    private readonly maxMetrics;
    recordQuery(projectName: string, duration: number, success: boolean, error?: string): void;
    getMetrics(): QueryMetrics[];
    getAverageQueryTime(projectName?: string): number;
    getSlowQueries(threshold?: number): QueryMetrics[];
    getErrorRate(projectName?: string): number;
}
export declare function retryDatabaseOperation<T>(operation: () => Promise<T>, maxRetries?: number, baseDelay?: number, projectName?: string): Promise<T>;
export declare const dbPerformanceMonitor: DatabasePerformanceMonitor;
export { dbInstances, firebaseConfigs };
export type { FirebaseConfig };
//# sourceMappingURL=firebase-config.d.ts.map