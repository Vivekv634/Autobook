import z from "zod";
import { themeSchema } from "./Theme.types";
export const UserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(100, "Name is too long"),
  email: z.string().email("Invalid email format"),
  theme: themeSchema,
});

export type UserType = z.infer<typeof UserSchema>;
