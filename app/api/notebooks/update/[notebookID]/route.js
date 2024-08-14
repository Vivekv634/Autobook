import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    let notebooks;
    const notesDocID = headers().get('notesDocID');
    const requestBody = await request.json();
    const { notebookID } = params;
    const notesDocRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const notesDocSnap = await transaction.get(notesDocRef);
      if (!notesDocSnap.exists()) {
        return NextResponse.json(
          { error: 'error getting notes data.' },
          { status: 500 },
        );
      } else {
        notebooks = notesDocSnap.data().notebook;
        notebooks = notebooks.map((notebook) => {
          if (notebook.notebookID === notebookID) {
            return { ...notebook, ...requestBody };
          } else {
            return notebook;
          }
        });
      }
      transaction.update(notesDocRef, { notebook: notebooks });
    });
    return NextResponse.json({ result: notebooks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

