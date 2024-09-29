import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function PUT(request) {
  try {
    const body = await request.json();
    const notesDocID = headers().get('notesDocID');
    const docRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse.json({ error: 'doc not found!' }, { status: 404 });
      }
      transaction.update(docRef, body);
    });
    return NextResponse.json(
      { result: 'Trash Interval time updated!' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
