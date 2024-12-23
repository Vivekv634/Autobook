import { userSchema } from '@/app/utils/schema';
import { auth, notesDB, userDB } from '@/firebase.config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, password } = await request.json();
  try {
    const response = await registerUser(name, email, password);
    await sendEmailVerification(response.user).then(() =>
      console.log('Email Verification Send!'),
    );
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const registerUser = async (name, email, password) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const notesSchema = {
    authID: response.user.uid,
  };
  const notesResponse = await addDoc(notesDB, notesSchema);
  const userData = {
    ...userSchema,
    name,
    email,
    authID: response.user.uid,
    notesDocID: notesResponse.id,
  };
  await addDoc(userDB, userData);
  return response;
};
