import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
// Removed default timezone setting to use UTC for storage

export const dateFormat: string = "MMMM DD, YYYY";
export const timestampFormat: string = "MMMM DD, YYYY hh:mm A";

export const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;
export const getCurrentMonthName = () => monthNames[dayjs.tz().month()];

// UTC timestamp functions for storage
export const getUTCTimestamp = () => dayjs.utc().toISOString();
export const getUTCDate = () => dayjs.utc().format(dateFormat);

// Legacy functions - now use Nairobi timezone for display only
export const getTimestamp = () => dayjs.tz().format(timestampFormat);
export const getDate = () => dayjs.tz().format(dateFormat);

export const formatDate = (date: Date | string | dayjs.Dayjs) => dayjs.tz(date).format(dateFormat);
export const formatTimestamp = (timestamp: Date | string | dayjs.Dayjs) => dayjs.tz(timestamp).format(timestampFormat);

