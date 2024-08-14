import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let response;
    const notesDocID = headers().get('notesDocID');
    const notesDocRef = doc(db, 'notes', notesDocID);
    await runTransaction(db, async (transaction) => {
      const notesDocSnap = await transaction.get(notesDocRef);
      if (!notesDocSnap.exists()) {
        return NextResponse.json(
          { error: 'getting error while retriving notes data' },
          { status: 500 },
        );
      } else {
        response = notesDocSnap.data().notebooks;
      }
    });
    return NextResponse.json({ result: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
