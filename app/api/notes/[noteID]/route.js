import { db } from '@/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// eslint-disable-next-line
export async function GET(request, { params }) {
  const notesDocID = headers().get('notesDocID');
  const { noteID } = params;
  try {
    let filterednotes;
    const notesRef = doc(db, 'notes', notesDocID);
    const notesSnap = await getDoc(notesRef);
    console.log(notesSnap.data().notes);
    if (notesSnap.exists()) {
      const notes = notesSnap.data().notes;
      filterednotes = notes.filter((note) => note.noteID === noteID);
    }
    return NextResponse.json({ result: filterednotes[0] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
