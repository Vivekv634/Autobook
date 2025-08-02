import { DaysType } from "@/types/AutoNote.types";

export function getNextWeekdayTimestamp(
  dayName: DaysType,
  hour: number,
  minute: number
) {
  const daysOfWeek: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = daysOfWeek[dayName];
  if (targetDay === undefined) {
    throw new Error("Invalid day name");
  }

  const now = new Date();
  const currentDay = now.getDay();

  const targetDate = new Date(now);
  targetDate.setHours(hour, minute, 0, 0);

  let daysAhead = targetDay - currentDay;
  if (daysAhead < 0 || (daysAhead === 0 && targetDate <= now)) {
    daysAhead += 7;
  }

  targetDate.setDate(now.getDate() + daysAhead);

  return targetDate.getTime();
}
