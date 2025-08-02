import z from "zod";

export const PagesEnum = z.enum([
  "notes",
  "notebooks",
  "trash",
  "shared notes",
] as const);

export type PageType = z.infer<typeof PagesEnum>;
