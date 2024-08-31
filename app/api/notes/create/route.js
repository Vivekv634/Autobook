import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { notes } from '@/app/utils/schema';

export async function POST(request) {
  const notesDocID = headers().get('notesDocID');
  const notesData = notes;
  const body = await request.json();
  const docRef = doc(db, 'notes', notesDocID);
  try {
    let notes;
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.notes) {
          notes = [{ ...notesData, ...body }];
          transaction.set(docRef, { ...data, notes: notes });
        } else {
          notes = data.notes;
          notes.push({ ...notesData, ...body });
          transaction.update(docRef, { notes: notes });
        }
      }
    });
    return NextResponse.json({ result: notes }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
