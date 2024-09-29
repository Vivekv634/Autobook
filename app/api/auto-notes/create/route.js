import { autoNote } from '@/app/utils/schema';
import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let autoNotes;
    const notesDocID = headers().get('notesDocID');
    const body = await request.json();
    const autoNoteData = {
      ...autoNote,
      ...body,
      autoNoteUpdationDate: new Date().getTime(),
      template: {
        body: {
          blocks: [
            ...autoNote.template.body.blocks,
            ...body.template.body.blocks,
          ],
        },
      },
    };
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: 'error getting notes' },
          { status: 404 },
        );
      }
      const data = docSnap.data();
      if (!data?.autoNotes) {
        autoNotes = [autoNoteData];
        transaction.update(docRef, { autoNotes: autoNotes });
      } else {
        autoNotes = data.autoNotes;
        autoNotes.push(autoNoteData);
        transaction.update(docRef, { autoNotes: autoNotes });
      }
    });
    return NextResponse.json({ result: autoNotes }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
