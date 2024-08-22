import { db } from '@/firebase.config';
import { doc, runTransaction } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    let updatedData = {};
    const { userID } = params;
    const body = await request.json();
    const docRef = doc(db, 'users', userID);
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: 'getting error while retriving data.' },
          { status: 500 },
        );
      }
      const userData = docSnap.data();
      updatedData = { ...userData, ...body };
      transaction.update(docRef, updatedData);
    });
    return NextResponse.json({ result: updatedData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
