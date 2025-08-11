import { AutoNoteType } from "@/types/AutoNote.types";
import { NoteType } from "@/types/Note.type";
import { UserType } from "@/types/User.type";

export default function emailBodyHelper(
  user: UserType,
  note: NoteType,
  autonote: AutoNoteType
) {
  return `${user.name}, Your new note <b>${note.title}</b> is created by <b>${autonote.title}</b>`;
}
