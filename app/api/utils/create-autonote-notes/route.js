import noteGenerationPeriodTime from '@/app/utils/noteGenerationPeriodTime';
import { autoNote as AutoNote, notes as Notes } from '@/app/utils/schema';
import { titleFormatter } from '@/app/utils/titleFormatter';
import { db } from '@/firebase.config';
import * as emailjs from '@emailjs/nodejs';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';

async function sendEmail({
  receiver_email,
  autoNoteName,
  receiver_name,
  subject,
  noteTitle,
  visitLink,
}) {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        receiver_email,
        receiver_name,
        subject,
        noteTitle,
        autoNoteName,
        visitLink,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      },
    );
    console.info('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// eslint-disable-next-line no-unused-vars
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
              noteID: v4(),
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

            if (userDetails && userDetails.email) {
              const visitLink = `${process.env.API}/dashboard/${userDetails.notesDocID}/${newNoteBody.noteID}`;

              sendEmail({
                receiver_name: userDetails.name,
                receiver_email: userDetails.email,
                subject: 'New Note Generated',
                autoNoteName: autoNote.autoNoteName,
                noteTitle: newNoteBody.title,
                visitLink: visitLink,
              })
                .then((res) => console.log(res))
                .catch((error) => {
                  console.error('Failed to send email:', error);
                  return null;
                });
            }
            batch.update(notesDoc.ref, notesData);
          }
        }
      });
    });

    // await batch.commit();

    if (noteCreated) {
      return NextResponse.json(
        { result: `${noteCreated} AutoNotes notes updated successfully!` },
        { status: 201 },
      );
    }
    return NextResponse.json(
      { result: '0 AutoNote notes created.' },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
