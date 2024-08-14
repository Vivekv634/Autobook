import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function DELETE(request, { params }) {
  try {
    let notebooks;
    const notesDocID = headers().get('notesDocID');
    const notesDocRef = doc(db, 'notes', notesDocID);
    const { notebookID } = params;
    await runTransaction(db, async (transaction) => {
      const notesDocSnap = await transaction.get(notesDocRef);
      if (!notesDocSnap.exists()) {
        return NextResponse.json(
          { error: 'error getting notes data.' },
          { status: 500 },
        );
      } else {
        notebooks = notesDocSnap.data().notebooks;
        notebooks = notebooks.filter(
          (notebook) => notebook.notebookID !== notebookID,
        );
      }
      transaction.update(notesDocRef, { notebooks: notebooks });
    });
    return NextResponse.json({ result: notebooks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
