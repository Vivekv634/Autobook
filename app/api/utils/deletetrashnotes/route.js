import { db } from '@/firebase.config';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const currentTime = new Date().getTime();
    const notesCollection = collection(db, 'notes');
    const notesSnap = await getDocs(notesCollection);

    const batch = writeBatch(db);

    notesSnap.forEach((notesDoc) => {
      let filteredNotes = [];
      const notesData = notesDoc.data();
      if (notesData.notes) {
        notesData.notes.forEach((note) => {
          if (!(note.isTrash && note.deletionTimeStamp <= currentTime)) {
            filteredNotes.push(note);
          }
        });
        batch.update(notesDoc.ref, { notes: filteredNotes });
      }
    });

    await batch.commit();
    return NextResponse.json({ result: 'Old notes deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
