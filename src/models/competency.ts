// Competency Performance Evaluation Data Models

export interface Skill {
  id: string
  name: string
  description?: string
  category?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PositionSkill {
  skillId: string
  positionId: string
  threshold: number // 1-5, minimum expected level
  weight?: number // 0-100, optional weighting
  isRequired: boolean
  createdAt: Date
}

export interface Position {
  id: string
  title: string
  department: string
  skills: PositionSkill[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SkillEvidence {
  id: string
  type: "file" | "link"
  name: string
  url: string
  uploadedAt: Date
  fileSize?: number
  mimeType?: string
}

export interface EmployeeSelfAssessment {
  id: string
  employeeUid: string
  skillId: string
  cycleId: string
  selfScore: number // 1-5
  comment?: string
  evidence: SkillEvidence[]
  submittedAt?: Date
  isDraft: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ManagerSkillWeight {
  id: string
  managerUid: string
  employeeUid: string
  skillId: string
  cycleId: string
  weight: number // 0-100
  createdAt: Date
  updatedAt: Date
}

export interface ManagerCompetencyReview {
  id: string
  managerUid: string
  employeeUid: string
  skillId: string
  cycleId: string
  managerScore: number // 1-5
  managerComment?: string
  finalizedAt?: Date
  isDraft: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SkillGap {
  skillId: string
  skillName: string
  threshold: number
  selfScore?: number
  managerScore: number
  gap: number // threshold - managerScore (positive = below threshold)
  weight?: number
  isBelowThreshold: boolean
  isSurplus: boolean
}

export interface CompetencyGapAnalysis {
  employeeUid: string
  cycleId: string
  skillsAnalyzed: number
  skillsBelowThreshold: number
  surplusSkills: number
  collectiveThresholdMet: number // percentage 0-100
  gaps: SkillGap[]
  overallScore: number
  createdAt: Date
}

export interface DevelopmentAction {
  id: string
  skillId: string
  employeeUid: string
  cycleId: string
  type: "training" | "mentoring" | "project" | "course" | "other"
  title: string
  description: string
  targetDate?: Date
  status: "planned" | "in-progress" | "completed" | "cancelled"
  assignedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CompetencyPhase {
  phase: "self-assessment" | "manager-weighting" | "manager-review" | "gap-analysis"
  isOpen: boolean
  deadline?: Date
  isOverdue: boolean
  completedAt?: Date
}

export interface CompetencyCycleStatus {
  cycleId: string
  employeeUid: string
  phases: CompetencyPhase[]
  selfAssessmentCompleted: boolean
  managerWeightingCompleted: boolean
  managerReviewCompleted: boolean
  gapAnalysisGenerated: boolean
  acknowledgedByEmployee: boolean
  createdAt: Date
  updatedAt: Date
}

// UI State Types
export interface CompetencyFormData {
  selfAssessments: Record<
    string,
    {
      score: number
      comment: string
      evidence: SkillEvidence[]
    }
  >
  managerWeights: Record<string, number>
  managerReviews: Record<
    string,
    {
      score: number
      comment: string
    }
  >
}

export interface CompetencyValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  totalWeight?: number
  missingAssessments: string[]
}

// Filter and Search Types
export interface CompetencyFilters {
  skillCategories: string[]
  scoreRange: [number, number]
  gapRange: [number, number]
  hasEvidence: boolean | null
  belowThreshold: boolean | null
  phase: CompetencyPhase["phase"] | null
}

export type CompetencyViewMode = "self-assessment" | "manager-weighting" | "manager-review" | "gap-analysis" | "results"

export type CompetencyStatus = "not-started" | "in-progress" | "completed" | "overdue" | "locked"
