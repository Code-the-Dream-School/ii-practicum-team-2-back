import { format } from "date-fns";

/**
 * Parse date and return the day of the week
 */
export const getWeekdayFromDate = async (date: Date): Promise<string> => {
  return format(date, "EEEE");
};
