'use client';
import Editor from '@/app/components/Editor';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ShareComponent({ params }) {
  const { notesDocID, noteID } = params;
  const [, setEditorInstance] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.API}/api/notes/${noteID}`, {
          headers: {
            notesDocID: notesDocID,
          },
        })
        .then((res) => {
          setResponse(res);
        });
    };
    fetchData();
  }, [noteID, notesDocID]);

  if (response) {
    return (
      <section className="container">
        <Editor
          editorNote={response?.data?.result}
          readOnly={true}
          setEditorInstance={setEditorInstance}
        />
      </section>
    );
  } else {
    return null;
  }
}
