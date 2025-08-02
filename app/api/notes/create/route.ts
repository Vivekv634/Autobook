import { notesDB } from "@/firebase.config";
import { NoteType } from "@/types/Note.type";
import { doc, DocumentReference, setDoc } from "firebase/firestore";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers();
    const uid = headersList.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { note }: { note: NoteType } = await req.json();

    const docRef: DocumentReference = doc(notesDB, note.note_id);

    await setDoc(docRef, note).then(() => {
      console.log("Note created successfully");
    });
    return NextResponse.json({ result: note }, { status: 200 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
