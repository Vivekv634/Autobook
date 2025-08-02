import { db, notesDB, sharedNotesDB } from "@/firebase.config";
import { NoteType } from "@/types/Note.type";
import {
  deleteDoc,
  doc,
  DocumentReference,
  runTransaction,
  Transaction,
} from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function DELETE(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    const note_id = headersList.get("note_id");
    let deletedNote: NoteType | null = null;

    if (!uid || !note_id) {
      return NextResponse.json(
        { error: "uid or note_id is not found" },
        { status: 400 },
      );
    }

    const noteRef: DocumentReference = doc(notesDB, note_id);
    const sharedNoteRef: DocumentReference = doc(sharedNotesDB, note_id);
    await runTransaction(db, async (transaction: Transaction) => {
      const noteSnap = await transaction.get(noteRef);
      const sharedNoteSnap = await transaction.get(sharedNoteRef);

      if (!noteSnap.exists()) {
        return NextResponse.json({ error: "Note not found!" }, { status: 404 });
      }

      if ((noteSnap.data() as NoteType).auth_id !== uid) {
        return NextResponse.json(
          { error: "auth_id didn't match" },
          { status: 400 },
        );
      }

      deletedNote = noteSnap.data() as NoteType;

      if (sharedNoteSnap) {
        await deleteDoc(sharedNoteRef);
      }

      await deleteDoc(noteRef);
    });

    return NextResponse.json({ result: deletedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
