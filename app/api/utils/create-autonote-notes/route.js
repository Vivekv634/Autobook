import noteGenerationPeriodTime from '@/app/utils/noteGenerationPeriodTime';
import { notes as Notes, autoNote as AutoNote } from '@/app/utils/schema';
import { titleFormatter } from '@/app/utils/titleFormatter';
import { db } from '@/firebase.config';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { uid } from 'uid';

//eslint-disable-next-line
export async function PATCH(request) {
  try {
    const notesCollection = collection(db, 'notes');
    const notesSnap = await getDocs(notesCollection);

    const batch = writeBatch(db);

    notesSnap.forEach((notesDoc) => {
      const notesData = notesDoc.data();
      const autoNotes = notesData?.autoNotes || [];

      autoNotes.forEach((autoNote) => {
        if (autoNote.state === 'running') {
          const noteGenerationPeriod = noteGenerationPeriodTime(
            autoNote.noteGenerationPeriod,
          );
          const lastNoteGenerationTime =
            noteGenerationPeriod + autoNote.lastNoteGenerationTime;
          const currentTime = Date.now();

          if (lastNoteGenerationTime <= currentTime) {
            const newNoteBody = {
              ...Notes,
              noteID: uid(),
              title: titleFormatter(
                autoNote.titleFormat,
                autoNote.noteGenerated,
              ),
              notebook_ref_id: autoNote.autoNoteNotebookID,
              body: JSON.stringify(autoNote.template.body.blocks),
            };
            notesData.notes.push(newNoteBody);

            const updatedAutoNoteBody = {
              ...AutoNote,
              ...autoNote,
              lastNoteGenerationTime: currentTime,
            };

            notesData.autoNotes = notesData.autoNotes.map((an) =>
              an.autoNoteID === autoNote.autoNoteID ? updatedAutoNoteBody : an,
            );

            batch.update(notesDoc.ref, notesData);
          }
        }
      });
    });

    await batch.commit();

    return NextResponse.json(
      { result: 'AutoNotes notes updated successfully!' },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
