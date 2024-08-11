import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const notesDocID = headers().get('notesDocID');
  try {
    let updatedNotes;
    const notesRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const notesSnap = await transaction.get(notesRef);
      if (!notesSnap.exists()) {
        return NextResponse.json({ 'error': 'getting error while retriving notes data' }, { status: 500 });
      }
      const notes = notesSnap.data().notes;
      if (notes) {
        updatedNotes = notes.filter(note => !note.isTrash)
      }
      transaction.update(notesRef, { ...notesData, notes: notes });
    }).then(() => console.log('Transaction successfully committed!'));
    return NextResponse.json({ 'result': updatedNotes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 'error': error.message }, { status: 500 });

  }
}
