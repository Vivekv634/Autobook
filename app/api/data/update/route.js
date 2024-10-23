import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function PUT(request) {
  try {
    let newBody;
    const body = await request.json();
    const notesDocID = headers().get('notesDocID');
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse({ error: 'doc not found' }, { status: 404 });
      }
      transaction.update(docRef, body);
    });
    return NextResponse.json({ result: newBody });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
