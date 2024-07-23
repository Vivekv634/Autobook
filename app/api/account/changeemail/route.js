import { auth, db } from "@/firebase.config";
import { sendEmailVerification, updateEmail } from "firebase/auth";
import { collection, doc, query, runTransaction, where } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
    const userDocID = headers().get('userDocID');
    const { newEmail } = await request.json();
    try {
        const userDocRef = doc(db, 'users', userDocID);
        await runTransaction(db, async (transaction) => {
            const userDataSnap = await transaction.get(userDocRef);
            updateEmail(auth.currentUser, newEmail).then(() => {
                sendEmailVerification(auth.currentUser).then(() => console.log('Email-verification email send!'));
            })
        })
        return NextResponse.json({ 'result': 'Email changed' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });
    }
}