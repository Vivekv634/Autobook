import { z } from "zod";

// 1. Declare DaysEnum first
export const DaysEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

// 2. Infer the type
export type DaysType = z.infer<typeof DaysEnum>;

// 3. Use DaysType here
export const DAYS: { day: DaysType; label: string }[] = [
  { day: "Sunday", label: "S" },
  { day: "Monday", label: "M" },
  { day: "Tuesday", label: "T" },
  { day: "Wednesday", label: "W" },
  { day: "Thursday", label: "T" },
  { day: "Friday", label: "F" },
  { day: "Saturday", label: "S" },
];

export const AutoNoteDaysEnum = z.array(DaysEnum);
export type AutoNoteDaysType = z.infer<typeof AutoNoteDaysEnum>;

// 4. Main schema
export const AutoNoteSchema = z.object({
  autonote_id: z.string().default(""),
  auth_id: z.string().default(""),
  note_id: z.string().default(""),
  title: z
    .string()
    .min(5, "AutoNote title should be atleast 5 characters long.")
    .max(50, "AutoNote title shold be atmost 50 charactes long.")
    .default("Note Title"),
  noteTitleFormat: z
    .string()
    .min(5, "Note title should be atleast 5 characters long.")
    .max(50, "Note title shold be atmost 50 charactes long.")
    .default("Note - {{note}}"),
  created_at: z.number().default(() => Date.now()),
  updated_at: z.number().default(() => Date.now()),
  status: z.enum(["active", "inactive"]).default("active"),
  days: AutoNoteDaysEnum.min(1)
    .max(7)
    .default(() => [DAYS[new Date().getDay()].day]),
  time: z.number().default(0),
});

// 5. Infer AutoNoteType
export type AutoNoteType = z.infer<typeof AutoNoteSchema>;
