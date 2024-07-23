import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const notesDocID = headers().get('notesDocID');
    const { noteId } = params;
    const { title, body } = await request.json();
    try {
        const notesRef = doc(db, 'notes', notesDocID);
        await runTransaction(db, async (transaction) => {
            const notesSnap = await transaction.get(notesRef);
            if (!notesSnap.exists()) {
                return NextResponse.json({ 'error': 'error getting notes data.' }, { status: 500 });
            }
            const notes = notesSnap.data().notes;
            const updatedNotes = notes.map(note => {
                if (note.noteID === noteId) {
                    return { ...note, title, body };
                } else {
                    return note
                }
            });
            transaction.update(notesRef, { notes: updatedNotes });
        }).then(() => console.log('Transaction successfully committed!'));
        return NextResponse.json({ 'result': updatedNotes }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });
    }
}