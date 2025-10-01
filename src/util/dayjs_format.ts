import dayjs from "dayjs";

export const dateFormat: string = "MMMM DD, YYYY";
export const timestampFormat: string = "MMMM DD, YYYY hh:mm A";

export const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
export const getCurrentMonthName = () => monthNames[dayjs().month()];

export const getTimestamp = () => dayjs().format(timestampFormat);
export const getDate = () => dayjs().format(dateFormat);

