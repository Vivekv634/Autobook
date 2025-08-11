import { DaysType } from "@/types/AutoNote.types";
export const daysOfWeek: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export function getNextWeekdayTimestamp(
  fromDate: Date,
  dayName: DaysType,
  hour: number,
  minute: number
) {
  const targetDay = daysOfWeek[dayName];
  if (targetDay === undefined) throw new Error("Invalid day name");

  const targetDate = new Date(fromDate);
  targetDate.setHours(hour, minute, 0, 0);

  let daysAhead = targetDay - fromDate.getDay();
  if (daysAhead <= 0) daysAhead += 7; // Always future

  targetDate.setDate(fromDate.getDate() + daysAhead);
  return targetDate.getTime();
}
