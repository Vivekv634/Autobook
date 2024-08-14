import { db } from '@/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function GET(request) {
  try {
    let deletedNotes = [];
    const notesDocID = headers().get('notesDocID');
    const notesRef = doc(db, 'notes', notesDocID);
    const notesSnap = await getDoc(notesRef);
    if (notesSnap.exists()) {
      const notes = notesSnap.data().notes;
      notes?.map((note) => {
        if (note.isTrash) {
          deletedNotes.push(note);
        }
      });
    }
    return NextResponse.json({ result: deletedNotes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
