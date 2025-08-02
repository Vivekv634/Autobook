import { notesDB } from "@/firebase.config";
import { NoteType } from "@/types/Note.type";
import { doc, DocumentReference, updateDoc } from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    const { note }: { note: NoteType } = await req.json();

    if (!uid || !note) {
      return NextResponse.json(
        { error: "uid or note is not given" },
        { status: 400 },
      );
    }

    const docRef: DocumentReference = doc(notesDB, note.note_id);
    if (docRef === null) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    await updateDoc(docRef, note).then(() => {
      console.log("Note updated successfully");
    });

    return NextResponse.json({ note }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
