import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE({ params }) {
  const notesDocID = headers().get('notesDocID');
  const { noteId } = params;
  try {
    let filteredNotes;
    const notesRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const notesSnap = await transaction.get(notesRef);
      if (!notesSnap.exists()) {
        return NextResponse.json(
          { error: 'getting error while retriving notes data' },
          { status: 500 },
        );
      }
      const notes = notesSnap.data().notes;
      filteredNotes = notes.filter((note) => note.noteID !== noteId);
      transaction.update(notesRef, { notes: filteredNotes });
    }).then(() => console.log('Transaction successfully committed!'));
    return NextResponse.json({ result: filteredNotes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

