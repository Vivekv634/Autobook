import axios from 'axios';
import React from 'react';
import ShareComponent from './ShareComponent';

export async function generateMetadata({ params }) {
  const { notesDocID, noteID } = params;

  const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
    headers: {
      notesDocID: notesDocID,
    },
  });

  return {
    title: `${response?.data?.result?.title} | AutoBook` ?? 'Title | AutoBook',
  };
}

const NoteEditorPage = ({ params }) => {
  return (
    <>
      <ShareComponent params={params} />
    </>
  );
};

export default NoteEditorPage;
