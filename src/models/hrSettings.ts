import { CompanyInfoModel } from "./companyInfo";
import { ImportLogModel } from "./import-log";
import { EvaluationCampaignModel, MonitoringPeriodModel, PeriodicOptionModel } from "./performance";

export interface HrSettingsByType {
    companyInfo: CompanyInfoModel[];
    leaveSettings: LeaveSettingsModel[];
    payrollSettings: PayrollSettingsModel[];
    departmentSettings: DepartmentSettingsModel[];
    sectionSettings: SectionSettingsModel[];
    periodicOptions: PeriodicOptionModel[];
    evaluationCampaigns: EvaluationCampaignModel[];
    monitoringPeriods: MonitoringPeriodModel[];
    notificationTypes: NotificationTypeModel[];
    locations: LocationModel[];
    maritalStatuses: MaritalStatusModel[];
    contractTypes: ContractTypeModel[];
    contractHours: ContractHourModel[];
    reasonOfLeaving: ReasonOfLeavingModel[];
    probationDays: ProbationDayModel[];
    salaryScales: SalaryScaleModel[];
    leaveTypes: LeaveTypeModel[];
    eligibleLeaveDays: EligibleLeaveDaysModel[];
    backdateCapabilities: BackdateCapabilitiesModel[];
    accrualConfigurations: AccrualConfigurationModel[];
    holidays: HolidayModel[];
    shiftHours: ShiftHourModel[];
    shiftTypes: ShiftTypeModel[];
    overtimeTypes: OvertimeConfigurationModel[];
    competencies: CompetenceModel[];
    grades: GradeDefinitionModel[];
    positions: PositionDefinitionModel[];
    competencePositionAssociations: CompetencePositionAssociationModel[];
    importLogs: ImportLogModel[];
    hiringNeedTypes: HiringNeedTypeModel[];
    levelOfEducations: LevelOfEducationModel[];
    yearsOfExperiences: YearsOfExperienceModel[];
    strategicObjectives: StrategicObjectiveModel[];
    departmentKPIs: DepartmentKPIModel[];
    tmCategories: TMCategory[];
    tmComplexity: TMComplexityModel[];
    tmLengths: TMLengthModel[];
    paymentTypes: PaymentTypeModel[];
    deductionTypes: DeductionTypeModel[];
    loanTypes: LoanTypeModel[];
    taxes: TaxModel[];
    currencies: CurrencyModel[];
    pension: PensionModel[];
}

export interface TMCategory {
    id: string;
    timestamp: string;
    name: string;
    active: 'Yes' | 'No';
}

export interface TMLengthModel {
    id: string;
    timestamp: string;
    name: string;
    active: 'Yes' | 'No';
}

export interface TMComplexityModel {
    id: string;
    timestamp: string;
    name: string;
    active: 'Yes' | 'No';
}

export interface PaymentTypeModel {
    id: string;
    paymentName: string;
    paymentType: string;
    taxabilityThresholdType: "Percentage" | "Value";
    taxabilityThresholdAmount: number;
    active: boolean;
}

export interface DeductionTypeModel {
    id: string;
    deductionName: string;
    active: boolean;
}

export interface LoanTypeModel {
    id: string
    timestamp: string
    loanName: string
    loanInterestRate: number
    marketInterestRate: number
    active: boolean
}

export interface TaxPercentageModel {
    upperBound: number;
    percentage: number;
}

export interface TaxModel {
    id: string;
    timestamp: string;
    taxName: string;
    taxRates: TaxPercentageModel[];
    upperTaxRate: number;
    active: boolean;
}

export interface CurrencyModel {
    id: string;
    timestamp: string;
    name: string;
    exchangeRate: number;
    active: boolean;
}

export interface PensionModel {
    id: string;
    employerPensionType: 'Percentage' | 'Fixed Amount';
    employerPension: number;
    employeePensionType: 'Percentage' | 'Fixed Amount';
    employeePension: number;
}
export interface DepartmentSettingsModel {
    id: string;
    name: string;
    code: string;
    manager: string;
    location: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AccrualConfigurationModel {
    id: string;
    limitUnusedDays: number;
    limitMonths: number;
    createdAt?: string;
    updatedAt?: string;
}
export interface BackdateCapabilitiesModel {
    id: string;
    allowBackdatedRequests: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface EligibleLeaveDaysModel {
    id: string;
    numberOfYears: number;
    numberOfDays: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeaveTypeModel {
    id: string;
    name: string;
    authorizedDays: number;
    acronym: string;
    active: "Yes" | "No";
    createdAt?: string;
    updatedAt?: string;
}

export interface SalaryScaleModel {
    id: string
    numberOfSteps: number
    scales: ScaleModel[]
    createdAt?: string;
    updatedAt?: string;
}

export interface ScaleModel {
    row: number
    column: number
    grade: string
    salary?: number
}


export interface ProbationDayModel {
    id: string
    value: number
    createdAt?: string;
    updatedAt?: string;
}

export interface ReasonOfLeavingModel {
    id: string
    name: string
    startDate: string
    endDate: string
    active: "Yes" | "No"
    createdAt?: string;
    updatedAt?: string;
}


export interface ContractHourModel {
    id: string;
    hourPerWeek: number;
    startDate: string;
    endDate: string;
    active: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContractTypeModel {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    active: "Yes" | "No";
    createdAt?: string;
    updatedAt?: string;
}

export interface MaritalStatusModel {
    id: string;
    name: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LocationModel {
    id: string
    parentId?: string | null
    type: string
    name: string
    startDate: string
    endDate: string
    active: string
    description?: string
    address?: string
    createdAt?: string
    updatedAt?: string
}

export interface NotificationTypeModel {
    id: string;
    notificationType: string;
    text: string;
    active: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DepartmentSettingsModel {
    id: string;
    name: string;
    code: string;
    manager: string;
    location: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SectionSettingsModel {
    id: string;
    name: string;
    code: string;
    department: string;
    supervisor: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LeaveSettingsModel {
    maxAnnualLeaveDays: number;
    carryOverLimit: number;
}


export interface ShiftTypeModel {
    id: string
    timestamp: string
    name: string
    workingDays: WorkingDayModel[]
    startDate: string
    endDate: string
    active: "Yes" | "No"
}
export interface WorkingDayModel {
    dayOfTheWeek: string
    associatedShiftHour: string
}


export interface PayrollSettingsModel {
    baseCurrency: string;
    taxRate: number;
}

export interface HolidayModel {
    id: string;
    timestamp: string;
    name: string;
    date: string;
    active: "Yes" | "No";
}

export interface ShiftHourModel {
    id: string
    timestamp: string
    name: string
    shiftHours: ShiftHourDivision[]
    active: "Yes" | "No"
}

export interface ShiftHourDivision {
    startTime: string
    endTime: string
}

export interface ShiftTypeModel {
    id: string
    timestamp: string
    name: string
    workingDays: WorkingDayModel[]
    startDate: string
    endDate: string
    active: "Yes" | "No"
}

export interface WorkingDayModel {
    dayOfTheWeek: string
    associatedShiftHour: string
}

export interface OvertimeConfigurationModel {
    id: string
    timestamp: string
    overtimeType: string
    overtimeRate: number
    active: "Yes" | "No"
}


export type CompetenceModel = {
    id: string
    competenceName: string
    competenceType: string
    active: "Yes" | "No"
    createdAt: string;
    updatedAt: string;
}

export interface GradeDefinitionModel {
    id: string
    grade: string
    startDate: string
    endDate: string
    active: "Yes" | "No"
    createdAt: string;
    updatedAt: string;
}

export interface PositionDefinitionModel {
    id: string
    name: string
    startDate: string
    endDate: string
    positionDescription: string
    additionalInformation: string | null
    band: string | null
    grade: string
    active: "Yes" | "No"
    critical: "Yes" | "No"
    successionPlanningID?: string
    keys: string[]
    companyProfile: string | null
    companyProfileUsed: boolean | null
    step: string | null
    competencies: string[]
    createdAt: string;
    updatedAt: string;
}

export interface CompetencePositionAssociationModel {
    id: string
    pid: string
    cid: string
    grade: string
    threshold: number
    active: "Yes" | "No"
    createdAt: string;
    updatedAt: string;
}

// TA
export interface HiringNeedTypeModel {
    id: string;
    name: string;
    active: boolean;
    timestamp: string;
}
export interface LevelOfEducationModel {
    id: string;
    name: string;
    active: boolean;
    timestamp: string;
}
export interface YearsOfExperienceModel {
    id: string;
    name: string;
    active: boolean;
    timestamp: string;
}
// HR performance
export interface StrategicObjectiveModel {
    id: string;
    title: string;
    description: string;
    perspective: "Financial" | "Customer" | "Internal" | "Learning";
    weight: number;
    status: "Draft" | "Active" | "Archived";
    owner: string;
    period: string // this periodID
    round: string //this roundID
}
export interface DepartmentKPIModel {
    id: string;
    title: string;
    description: string;
    department: string;
    target: string;
    linkedObjectiveId: string[];
    dataSource: "Manual" | "System" | "Employee Objectives";
    status: "Draft" | "Active" | "Archived";
}


export interface HrSettingsMap {
    companyInfo: CompanyInfoModel;
    leaveSettings: LeaveSettingsModel;
    payrollSettings: PayrollSettingsModel;
    departmentSettings: DepartmentSettingsModel;
    sectionSettings: SectionSettingsModel;
    periodicOptions: PeriodicOptionModel;
    evaluationCampaigns: EvaluationCampaignModel;
    monitoringPeriods: MonitoringPeriodModel;
    notificationTypes: NotificationTypeModel;
    locations: LocationModel;
    maritalStatuses: MaritalStatusModel;
    contractTypes: ContractTypeModel;
    contractHours: ContractHourModel;
    reasonOfLeaving: ReasonOfLeavingModel;
    probationDays: ProbationDayModel;
    salaryScales: SalaryScaleModel;
    leaveTypes: LeaveTypeModel;
    eligibleLeaveDays: EligibleLeaveDaysModel;
    backdateCapabilities: BackdateCapabilitiesModel;
    shiftTypes: ShiftTypeModel;
    accrualConfigurations: AccrualConfigurationModel;
    holidays: HolidayModel;
    shiftHours: ShiftHourModel;
    overtimeTypes: OvertimeConfigurationModel;
    competencies: CompetenceModel;
    grades: GradeDefinitionModel;
    positions: PositionDefinitionModel;
    competencePositionAssociations: CompetencePositionAssociationModel;
    hiringNeedTypes: HiringNeedTypeModel;
    levelOfEducations: LevelOfEducationModel;
    yearsOfExperiences: YearsOfExperienceModel;
    strategicObjectives: StrategicObjectiveModel;
    departmentKPIs: DepartmentKPIModel;
    tmCategories: TMCategory;
    tmLengths: TMLengthModel;
    tmComplexity: TMComplexityModel;
    paymentTypes: PaymentTypeModel;
    deductionTypes: DeductionTypeModel;
    loanTypes: LoanTypeModel;
    taxes: TaxModel;
    currencies: CurrencyModel;
    pension: PensionModel;
}

export type HrSettingsType = keyof HrSettingsMap;
