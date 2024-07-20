import { auth, userDB } from "@/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const response = await loginUser(email, password);
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });
    }
};

const loginUser = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const q = query(userDB, where('email', '==', response.user.email));
    const docSnap = await getDocs(q);
    let userDoc, userDocID;
    docSnap.forEach(doc => {
        userDoc = doc.data()
        userDocID = doc.id
    })
    return { response, userDoc, userDocID };
}