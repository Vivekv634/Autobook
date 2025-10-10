import { AutoNoteDaysType } from "@/types/AutoNote.types";

export const dayNames: AutoNoteDaysType = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getNextDay(currentDay: number, days: AutoNoteDaysType) {
  for (let i = 0; i < 7; i++) {
    const nextDay = (currentDay + i + 1) % 7;
    if (days.includes(dayNames[nextDay])) {
      return dayNames[nextDay];
    }
  }
  return dayNames[currentDay];
}

export function noteTitleFormatter(titleFormat: string): string {
  const date = new Date();
  const time24 = date.toTimeString().split(" ")[0];
  const time12 = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear().toString();

  return titleFormat
    .replace(/{{time}}/g, time24)
    .replace(/{{time12}}/g, time12)
    .replace(/{{date}}/g, date.toLocaleDateString())
    .replace(/{{day}}/g, day)
    .replace(/{{month}}/g, month)
    .replace(/{{year}}/g, year);
}
