import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { uid } from "uid";

export async function POST(request) {
    const notesDocID = headers().get('notesDocID');
    const notesData = {
        noteID: uid(),
        updation_date: new Date().toString(),
        notesbook_ref_id: null,
        tagsList: [],
        isPinned: false,
        isReadOnly: false,
        isFavorite: false,
        isLocked: false,
        isTrash: false,
        deletionTimeStamp: new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
    };
    const body = await request.json();
    const docRef = doc(db, 'notes', notesDocID);
    try {
        let notes;
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (!data.notes) {
                    notes = [{ ...notesData, ...body }];
                    transaction.set(docRef, { ...data, notes: notes });
                } else {
                    notes = data.notes;
                    notes.push({ ...notesData, ...body });
                    transaction.update(docRef, { notes: notes });
                }
            }
        });
        return NextResponse.json({ 'result': notes }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ 'error': error.message }, { status: 500 });
    }
}