import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server"

export async function PUT() {
  try {
    let updatedNotes;
    const notesDocID = headers().get('notesDocID');
    const notesRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async transaction => {
      const notesSnap = await transaction.get(notesRef);
      if (!notesSnap.empty) {
        return NextResponse.json({ error: 'getting error while retriving notes data' }, { status: 500 });
      }
      notesSnap.data().notes?.map(note => {
        if (note.isTrash) {
          updatedNotes.push({ ...note, isTrash: false });
        }
        updatedNotes.push(note);
      });
      transaction.update(notesRef, { notes: updatedNotes });
    })
    return NextResponse.json({ result: updatedNotes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
