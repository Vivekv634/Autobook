import { auth } from "@/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    const email = headers().get('email');
    try {
        sendPasswordResetEmail(auth, email).then(() => {
            console.log('Password reset email send!');
        })
        return NextResponse.json({ 'result': 'Email Send!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'result': error.message }, { status: 500 });
    }
}