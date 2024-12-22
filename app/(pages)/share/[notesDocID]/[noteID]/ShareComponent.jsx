import axios from "axios";
import dynamic from "next/dynamic";

const NoteEditor = dynamic(() => import("@/app/components/NoteEditor"), {
  ssr: false,
});

export default async function ShareComponent({ params }) {
  const { notesDocID, noteID } = params;
  const response = await axios.get(`${process.env.API}/api/notes/${noteID}`, {
    headers: {
      notesDocID: notesDocID,
    },
  });

  if (response.data.result) {
    return (
      <NoteEditor
        noteData={response.data.result}
        params={params}
        readOnly={true}
      />
    );
  } else {
    return null;
  }
}
