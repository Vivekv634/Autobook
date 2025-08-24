import z from "zod";
import { themeSchema } from "./Theme.types";

export const responseTypeSchema = z
  .enum(["concise", "detailed", "balanced"])
  .default("balanced");

export type responseType = z.infer<typeof responseTypeSchema>;
export const UserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100, "Name is too long"),
  photoURL: z.string().url("Invalid URL").optional(),
  email: z.string().email("Invalid email format"),
  gemini_api_key: z.string().optional(),
  responseType: responseTypeSchema,
  theme: themeSchema,
  themeScope: z.enum(["editor", "app"]).default("editor"),
});

export type UserType = z.infer<typeof UserSchema>;
