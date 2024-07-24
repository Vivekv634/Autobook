import { db } from "@/firebase.config";
import { doc, runTransaction } from "firebase/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uid } from "uid";

export async function POST(request) {
    try {
        const notesDocID = headers().get('notesDocID');
        const { notebookName } = await request.json();
        const notesDocRef = doc(db, 'notes', notesDocID);
        const newNotebook = {
            notebookID: uid(),
            notebookName: notebookName,
            notebookCreationDate: new Date().toString(),
            notes: []
        }
        let updatedData;
        await runTransaction(db, async (transaction) => {
            const notesDocSnap = await transaction.get(notesDocRef);
            if (!notesDocSnap.exists()) {
                return NextResponse.json({ 'error': 'error getting notes data.' }, { status: 500 });
            } else {
                const notesData = notesDocSnap.data();
                if (!notesData?.notebook) {
                    updatedData = { ...notesData, notebook: [newNotebook] };
                } else {
                    const notebook = notesData.notebook;
                    notebook.push(newNotebook);
                    updatedData = { ...notesData, notebook: notebook };
                }
            }
            transaction.update(notesDocRef, updatedData);
        })
        return NextResponse.json({ 'result': updatedData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 'error': error.message }, { status: 500 });
    }
}