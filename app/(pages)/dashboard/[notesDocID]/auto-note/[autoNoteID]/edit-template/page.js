import axios from 'axios';
import React from 'react';
import EditAutoNoteTemplate from './EditAutoNoteTemplate';

export async function generateMetadata({ params }) {
  const { notesDocID, autoNoteID } = params;

  const autoNotesResponse = await axios.get(
    `${process.env.API}/api/auto-notes`,
    {
      headers: {
        notesDocID: notesDocID,
      },
    },
  );
  let title;
  autoNotesResponse.data.result.map((autoNote) => {
    if (autoNote.autoNoteID == autoNoteID) {
      title = autoNote.autoNoteName;
    }
  });
  return {
    title: `${title} - AutoBook`,
  };
}

const NoteEditorPage = ({ params }) => {
  return (
    <>
      <EditAutoNoteTemplate params={params} />
    </>
  );
};

export default NoteEditorPage;
