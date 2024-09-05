import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { autoNote as AutoNote } from '@/app/utils/schema';

export async function PUT(request, { params }) {
  try {
    let updatedAutoNotes;
    const { autoNoteID } = params;
    const body = await request.json();
    const notesDocID = headers().get('notesDocID');
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: 'getting error while retriving notes data' },
          { status: 404 },
        );
      }
      const autoNotesData = docSnap.data().autoNotes;
      updatedAutoNotes = autoNotesData.map((autoNote) => {
        if (autoNote.autoNoteID === autoNoteID) {
          return {
            ...AutoNote,
            ...autoNote,
            ...body,
          };
        } else {
          return autoNote;
        }
      });
      transaction.update(docRef, { autoNotes: updatedAutoNotes });
    });
    return NextResponse.json({ result: updatedAutoNotes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
