import { db } from "@/firebase.config";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    const notesDocID = headers().get('notesDocID');
    try {
        const notesRef = doc(db, 'notes', notesDocID);
        const notesSnap = await getDoc(notesRef);
        if (!notesSnap.exists()) {
            return NextResponse.json({ error: 'getting error while retriving notes data' }, { status: 500 });
        }
        const notes = notesSnap.data().notes;
        return NextResponse.json({ result: notes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}