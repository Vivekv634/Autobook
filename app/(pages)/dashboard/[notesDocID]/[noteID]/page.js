import dynamic from 'next/dynamic';
import axios from 'axios';
import React from 'react';

const NoteEditor = dynamic(() => import('@/app/components/NoteEditor'), {
  ssr: false,
});

export async function generateMetadata({ params }) {
  const { notesDocID, noteID } = params;

  const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
    headers: {
      notesDocID: notesDocID,
    },
  });

  return {
    title: response.data.result.title ?? 'Title - AutoBook',
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
