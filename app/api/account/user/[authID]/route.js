import { userDB } from '@/firebase.config';
import { getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// eslint-disable-next-line
export async function GET(request, { params }) {
  try {
    let userData, userID;
    const { authID } = await params;
    const q = query(userDB, where('authID', '==', authID));
    const userSnap = await getDocs(q);
    if (userSnap.empty) {
      return NextResponse.json({ result: 'user not found!' }, { status: 400 });
    }
    userSnap.forEach((doc) => {
      userData = doc.data();
      userID = doc.id;
    });
    return NextResponse.json({ result: { userData, userID } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: error.message }, { status: 200 });
  }
}
