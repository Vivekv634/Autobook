import { db } from '@/firebase.config';
import { deleteDoc, doc } from 'firebase/firestore';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const userDocID = headers().get('userDocID');
  const userNotesID = headers().get('userNotesID');
  try {
    const userDocRef = doc(db, 'users', userDocID);
    await deleteDoc(userDocRef);
    const userNotesRef = doc(db, 'notes', userNotesID);
    await deleteDoc(userNotesRef);
    return NextResponse.json({ result: 'User Deleted!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
