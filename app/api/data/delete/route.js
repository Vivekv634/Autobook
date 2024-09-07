import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    const notesDocID = headers().get('notesDocID');
    const body = await request.json();
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'doc not found' }, { status: 404 });
      }
      transaction.update(docRef, body);
    });
    return NextResponse.json({ result: 'Data deleted!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
