import React from 'react';
import axios from 'axios';
import NoteEditor from '@/app/components/NoteEditor';

export async function generateMetadata({ params }) {
  let notesDocID;
  const { noteID } = params;

  const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
    headers: {
      notesDocID: notesDocID,
    },
  });

  return {
    title: response.data.result,
  };
}

const NoteEditorPage = ({ params }) => {
  return (
    <>
      <NoteEditor params={params} />
    </>
  );
};

export default NoteEditorPage;

