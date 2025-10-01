export interface DocumentDefinitionModel {
  id: string
  timestamp: string
  name: string
  subject: string
  header: string
  footer: string
  signature: string|null // signature workflow
  startDate: string
  endDate: string
  active: "Yes" | "No"
  content: string[] // Each is in Rich Text Format(DraftJs)
  initial: string|null
  initialNeeded: "Yes" | "No"
  employeeSignatureNeeded: "Yes" | "No"
  status: "Published" | "Unpublished"
  visibility: "Open" | "Restricted"
}