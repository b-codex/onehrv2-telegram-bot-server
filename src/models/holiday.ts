export interface HolidayModel {
    id?: string;
    timestamp: string;
    holidayID: string;
    name: string;
    date: string;
    active: "Yes" | "No";
}