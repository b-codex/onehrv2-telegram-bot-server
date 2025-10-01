export interface TrainingPathModel {
    id: string;
    timestamp: string;
    name: string;
    trainingMaterials:string[]
    category: string[];
    description: string;
    audienceTarget: string[];
    employees: string[];
    departments: string[];
    sections: string[];
    locations: string[];
    grades: string[];
    assignedBy: string;
    status: 'Created' | 'Approved' | 'Refused';
    dateRange: [string,string]; 
    estimatedDuration: number;
    outcome: string;
    justification: string;
    competencies: string[];
    employeeFeedbacks: FeedbackModel[];
  }

  export interface FeedbackModel {
    employeeUid: string;
    rating: number;
    comment: string;
}
  