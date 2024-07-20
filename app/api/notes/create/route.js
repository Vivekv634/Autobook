import { db } from "@/firebase.config";
import { getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request) {
    const usernotesID = headers().get('usernotesID');
    try {
        const docRef = doc(db, 'notes', usernotesID);
        const doc = await getDoc(docRef);
        console.log(doc.data());
        return NextResponse.json({'result': doc.data()})
    } catch (error) {
        return NextResponse.json({ 'result': 'Internal Server Error' });
    }
}