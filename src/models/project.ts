export type ProjectStatus = "Planning" | "Active" | "In Progress" | "Completed" | "On Hold" | "Cancelled";

export interface AllocationModel {
  uid: string;
  allocation: number; // percent
}

export interface ProjectModel {
  id: string;
  timestamp: string;
  name: string;
  description: string;
  deadline: string;
  assignedMembers: string[]; // Array of employee uids
  employeeAllocations: AllocationModel[];
  status: ProjectStatus;
  createdBy: string | null; 
}