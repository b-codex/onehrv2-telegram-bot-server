import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Africa/Nairobi");
 
export const dateFormat: string = "MMMM DD, YYYY";
export const timestampFormat: string = "MMMM DD, YYYY hh:mm A";

export const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
export const getCurrentMonthName = () => monthNames[dayjs.tz().month()];

export const getTimestamp = () => dayjs.tz().format(timestampFormat);
export const getDate = () => dayjs.tz().format(dateFormat);

