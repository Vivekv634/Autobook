import sendEmail from '@/app/utils/emailTransporter';
import noteGenerationPeriodTime from '@/app/utils/noteGenerationPeriodTime';
import { notes as Notes, autoNote as AutoNote } from '@/app/utils/schema';
import { titleFormatter } from '@/app/utils/titleFormatter';
import { db } from '@/firebase.config';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { uid } from 'uid';
import { emailTemplate } from '@/app/utils/emailTemplate';

//eslint-disable-next-line
export async function PATCH(request) {
  try {
    const notesCollection = collection(db, 'notes');
    const userCollection = collection(db, 'users');
    const notesSnap = await getDocs(notesCollection);
    const userSnap = await getDocs(userCollection);

    let updatedAutoNoteBody,
      newNoteBody,
      noteCreated = 0;
    const batch = writeBatch(db);

    notesSnap.forEach((notesDoc) => {
      const notesData = notesDoc.data();
      const autoNotes = notesData?.autoNotes || [];

      const user = userSnap.docs.find(
        (userDoc) => userDoc.data().authID === notesData.authID,
      );
      const userDetails = user ? user.data() : null;

      autoNotes.forEach((autoNote) => {
        if (autoNote.state === 'running') {
          const noteGenerationPeriod = noteGenerationPeriodTime(
            autoNote.noteGenerationPeriod,
          );
          const lastNoteGenerationTime =
            noteGenerationPeriod + autoNote.lastNoteGenerationTime;
          const currentTime = new Date().getTime();

          if (lastNoteGenerationTime <= currentTime) {
            newNoteBody = {
              ...Notes,
              noteID: uid(),
              title: titleFormatter(
                autoNote.titleFormat,
                autoNote.noteGenerated,
              ),
              notebook_ref_id: autoNote.autoNoteNotebookID,
              body: autoNote.template ?? '{}',
            };
            notesData.notes.push(newNoteBody);
            updatedAutoNoteBody = {
              ...AutoNote,
              ...autoNote,
              autoNoteUpdationDate: new Date().toString(),
              noteGenerated: autoNote.noteGenerated + 1,
              lastNoteGenerationTime: currentTime,
            };
            notesData.autoNotes = notesData.autoNotes.map((an) =>
              an.autoNoteID === autoNote.autoNoteID ? updatedAutoNoteBody : an,
            );
            noteCreated++;
            const visitLink = `https://autobook1.vercel.app/dashboard/${userDetails.notesDocID}/${newNoteBody.noteID}`;
            sendEmail(
              userDetails?.email,
              'Note Created by AutoNote',
              emailTemplate(
                userDetails.name,
                autoNote.autoNoteName,
                titleFormatter(autoNote.titleFormat, autoNote.noteGenerated),
                visitLink,
              ),
            );
            batch.update(notesDoc.ref, notesData);
          }
        }
      });
    });

    await batch.commit();

    return NextResponse.json(
      { result: `${noteCreated} AutoNotes notes updated successfully!` },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
