import noteGenerationPeriodTime from '@/app/utils/noteGenerationPeriodTime';
import { notes as Notes, autoNote as AutoNote } from '@/app/utils/schema';
import { titleFormatter } from '@/app/utils/titleFormatter';
import { db } from '@/firebase.config';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { v4 } from 'uuid';
import nodemailer from 'nodemailer';
import { emailTemplate } from '@/app/utils/emailTemplate';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: true,
  },
});

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
              const to = userDetails.email;
              const html = emailTemplate(
                userDetails.name,
                autoNote.autoNoteName,
                newNoteBody.title,
                visitLink,
              );

              transporter
                .sendMail({
                  from: process.env.EMAIL,
                  to,
                  subject: 'New AutoNote Created!',
                  html,
                })
                .then(() => console.log(`Email sent to ${userDetails.email}`))
                .catch((error) => console.error('Error sending email:', error));
            }
            console.info({
              from: process.env.EMAIL,
              to: userDetails.email,
            });

            batch.update(notesDoc.ref, notesData);
          }
        }
      });
    });

    await batch.commit();

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
