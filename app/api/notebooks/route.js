import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        let response;
        const notesDocID = headers().get('notesDocID');
        const notesDocRef = doc(db, 'notes', notesDocID);
        await runTransaction(db, async (transaction) => {
            const notesDocSnap = await transaction.get(notesDocRef);
            if (!notesDocSnap.exists()) {
                return NextResponse.json({ 'error': error.message }, { status: 500 });        
            } else {
                response = notesDocSnap.data().notebook;
            }
        })
        return NextResponse.json({ 'result': response }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });        
    }
}