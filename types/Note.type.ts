import { z } from "zod";

export const NoteSchema = z.object({
  auth_id: z.string(),
  note_id: z.string().uuid("Invalid UUID format for note_id"),
  title: z
    .string()
    .min(3, "Title should be atleast 3 characters long.")
    .max(50, "Title should be atmost 50 characters long."),
  body: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  tags: z.array(z.string()).optional(),
  notebookRefId: z
    .string()
    .uuid("Invalid UUID format for notebookRefId")
    .optional(),
});

export type NoteType = z.infer<typeof NoteSchema>;
