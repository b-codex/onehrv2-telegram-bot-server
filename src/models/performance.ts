export interface PeriodicOptionModel {
    id: string | null;
    timestamp: string;
    periodName: string;
    year: number;
    evaluations: PeriodicOptionRoundsModel[];
}

export interface PeriodicOptionRoundsModel {
    id: string | null;
    round: string;
    from: string;
    to: string;
}

export interface EvaluationCampaignModel {
    id: string | null;
    timestamp: string;
    periodID: string;
    roundID: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    associatedEmployees: string[];
    promotionTriggered: boolean;
}

export interface MonitoringPeriodModel {
    id: string | null;
    timestamp: string;
    periodID: string;
    roundID: string;
    monitoringPeriodName: string;
    startDate: string;
    endDate: string;
}// Core Performance Management Data Models

// User and Role Models
export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    department: string
    position: string
    managerId?: string
    directReports?: string[]
    avatar?: string
}

export type UserRole = "employee" | "manager" | "hr" | "admin"

// Evaluation Cycle Model
export interface EvaluationCycle {
    id: string
    name: string
    description: string
    startDate: Date
    endDate: Date
    status: CycleStatus
    phases: CyclePhase[]
    objectivePerformanceScore: number
    competencyPerformanceScore: number
    evaluationPerformanceScore: number
    participants: string[] // User IDs
    settings: CycleSettings
    createdAt: Date
    updatedAt: Date
}

export type CycleStatus = "draft" | "active" | "review" | "completed" | "archived"

export interface CyclePhase {
    id: string
    name: string
    description: string
    startDate: Date
    endDate: Date
    type: PhaseType
    status: PhaseStatus
    requirements: string[]
}

export type PhaseType = "objective-setting" | "self-assessment" | "manager-review" | "calibration" | "feedback"
export type PhaseStatus = "pending" | "active" | "completed" | "overdue"

export interface CycleSettings {
    allowSelfAssessment: boolean
    requireManagerReview: boolean
    enablePeerFeedback: boolean
    autoProgressPhases: boolean
    reminderSettings: ReminderSettings
}

export interface ReminderSettings {
    enabled: boolean
    daysBeforeDeadline: number[]
    emailNotifications: boolean
    inAppNotifications: boolean
}

// Objective Model
export interface Objective {
    id: string
    cycleId: string
    employeeId: string
    managerId: string
    title: string
    description: string
    smartCriteria: SMARTCriteria
    category: ObjectiveCategory
    priority: Priority
    weight: number // Percentage weight in overall evaluation
    targetDate: Date
    status: ObjectiveStatus
    progress: number // 0-100 percentage
    kpis: KPI[]
    actionItems: ActionItem[]
    selfEvaluation?: SelfEvaluation
    managerEvaluation?: ManagerEvaluation
    feedback: Feedback[]
    attachments: Attachment[]
    createdAt: Date
    updatedAt: Date
}

export interface SMARTCriteria {
    specific: string
    measurable: string
    achievable: string
    relevant: string
    timeBound: string
}

export type ObjectiveCategory = "performance" | "development" | "behavioral" | "strategic" | "operational"
export type Priority = "low" | "medium" | "high" | "critical"
export type ObjectiveStatus = "draft" | "active" | "completed" | "cancelled" | "overdue"

export interface KPI {
    id: string
    name: string
    description: string
    targetValue: number
    currentValue: number
    unit: string
    measurementMethod: string
}

export interface ActionItem {
    id: string
    title: string
    description: string
    dueDate: Date
    status: ActionItemStatus
    priority: Priority
    assignedTo: string
    completedAt?: Date
    notes?: string
}

export type ActionItemStatus = "pending" | "in-progress" | "completed" | "blocked"

// Evaluation Models
export interface SelfEvaluation {
    id: string
    objectiveId: string
    employeeId: string
    rating: number // 1-5 scale
    progressDescription: string
    challengesFaced: string
    supportNeeded: string
    evidenceProvided: string[]
    submittedAt: Date
}

export interface ManagerEvaluation {
    id: string
    objectiveId: string
    managerId: string
    employeeId: string
    rating: number // 1-5 scale
    feedback: string
    developmentAreas: string[]
    strengths: string[]
    recommendedActions: string[]
    calibrationNotes?: string
    submittedAt: Date
}

// Competency Model
export interface Competency {
    id: string
    name: string
    description: string
    category: CompetencyCategory
    level: CompetencyLevel
    behaviors: Behavior[]
    requiredForRoles: string[]
}

export type CompetencyCategory = "technical" | "leadership" | "communication" | "problem-solving" | "teamwork"
export type CompetencyLevel = "beginner" | "intermediate" | "advanced" | "expert"

export interface Behavior {
    id: string
    description: string
    level: CompetencyLevel
    examples: string[]
}

export interface CompetencyAssessment {
    id: string
    cycleId: string
    employeeId: string
    competencyId: string
    selfRating: number // 1-5 scale
    managerRating?: number // 1-5 scale
    gap: number // Difference between required and actual
    developmentPlan?: DevelopmentPlan
    evidence: string[]
    comments: string
    assessedAt: Date
}

export interface DevelopmentPlan {
    id: string
    competencyId: string
    employeeId: string
    currentLevel: number
    targetLevel: number
    actions: DevelopmentAction[]
    timeline: string
    resources: string[]
    successMetrics: string[]
}

export interface DevelopmentAction {
    id: string
    title: string
    description: string
    type: ActionType
    dueDate: Date
    status: ActionItemStatus
    completionCriteria: string
}

export type ActionType = "training" | "mentoring" | "project" | "reading" | "certification"

// Feedback Model
export interface Feedback {
    id: string
    fromUserId: string
    toUserId: string
    objectiveId?: string
    competencyId?: string
    type: FeedbackType
    content: string
    rating?: number
    isAnonymous: boolean
    createdAt: Date
}

export type FeedbackType = "objective" | "competency" | "general" | "peer" | "upward"

// Attachment Model
export interface Attachment {
    id: string
    name: string
    type: string
    size: number
    url: string
    uploadedBy: string
    uploadedAt: Date
}

// Performance Summary Models
export interface PerformanceSummary {
    id: string
    cycleId: string
    employeeId: string
    overallRating: number
    objectiveScore: number
    competencyScore: number
    objectives: ObjectiveSummary[]
    competencies: CompetencySummary[]
    strengths: string[]
    developmentAreas: string[]
    careerDiscussion: string
    nextCycleGoals: string[]
    managerComments: string
    employeeComments: string
    hrComments?: string
    finalizedAt?: Date
}

export interface ObjectiveSummary {
    objectiveId: string
    title: string
    weight: number
    rating: number
    status: ObjectiveStatus
}

export interface CompetencySummary {
    competencyId: string
    name: string
    selfRating: number
    managerRating: number
    gap: number
}

// Analytics and Reporting Models
export interface PerformanceMetrics {
    cycleId: string
    departmentId?: string
    totalParticipants: number
    completionRate: number
    averageRating: number
    ratingDistribution: RatingDistribution
    topPerformers: string[]
    improvementAreas: string[]
    generatedAt: Date
}

export interface RatingDistribution {
    excellent: number // 4.5-5.0
    good: number // 3.5-4.4
    satisfactory: number // 2.5-3.4
    needsImprovement: number // 1.5-2.4
    unsatisfactory: number // 1.0-1.4
}

// API Response Models
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasNext: boolean
    hasPrevious: boolean
}

// Form and UI State Models
export interface FormState<T> {
    data: T
    errors: Record<string, string>
    isSubmitting: boolean
    isDirty: boolean
}

export interface FilterOptions {
    cycles: string[]
    departments: string[]
    statuses: string[]
    priorities: string[]
    dateRange: DateRange
}

export interface DateRange {
    startDate: Date
    endDate: Date
}

export interface SortOption {
    field: string
    direction: "asc" | "desc"
}

// Notification Models
export interface Notification {
    id: string
    userId: string
    type: NotificationType
    title: string
    message: string
    actionUrl?: string
    isRead: boolean
    createdAt: Date
}

export type NotificationType = "deadline" | "review-request" | "feedback-received" | "cycle-update" | "reminder"
