import { db } from "@/firebase.config";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    const notesDocID = headers().get('notesDocID');
    try {
        const notesRef = doc(db, 'notes', notesDocID);
        await runTransaction(db, async (transaction) => {
            const notesSnap = await transaction.get(notesRef);
            if (!notesSnap.exists()) {
                return NextResponse.json({ 'error': 'getting error while retriving notes data' }, { status: 500 });
            }
            const notesData = notesSnap.data();
            transaction.update(notesRef, { ...notesData, notes: [] });
        }).then(() => console.log('Transaction successfully committed!'));
        return NextResponse.json({ 'result': 'All notes deleted!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });

    }
}