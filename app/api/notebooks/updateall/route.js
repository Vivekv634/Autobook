import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    let notebooksData;
    const body = await request.json();
    const notesDocID = headers().get('notesDocID');
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists())
        return NextResponse.json(
          { error: 'getting error while getting notes data' },
          { status: 404 },
        );
      notebooksData = docSnap.data().notebooks;
      notebooksData = body;
      transaction.update(docRef, { notebooks: notebooksData });
    });
    return NextResponse.json({ result: notebooksData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
