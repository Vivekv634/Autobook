import { z } from "zod";

export const themeSchema = z.enum([
  "default",
  "ocean-breeze",
  "mono",
  "notebook",
  "twitter",
  "supabase",
  "amber-minimal",
  "claude",
  "claymorphism",
  "modern-minimal",
]);

export type ThemeTypes = z.infer<typeof themeSchema>;
