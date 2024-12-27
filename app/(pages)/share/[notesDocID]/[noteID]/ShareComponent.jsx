'use client';
import Editor from '@/app/components/Editor';
import { cn } from '@/lib/utils';
import { poppins } from '@/public/fonts';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function ShareComponent({ params }) {
  const { notesDocID, noteID } = params;
  const editorInstance = useRef(null);
  const [response, setResponse] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${process.env.API}/api/notes/${noteID}`, {
          headers: {
            notesDocID: notesDocID,
          },
        })
        .then((res) => setResponse(res));
    };
    fetchData();
  });

  if (response?.data?.result) {
    return (
      <section className={cn(poppins.className, 'container mt-5')}>
        <h1 className="text-4xl font-bold">{response?.data?.result?.title}</h1>
        <Editor
          data={response?.data?.result?.body}
          readOnly={true}
          editorInstance={editorInstance}
        />
      </section>
    );
  } else {
    return (
      <section className={cn(poppins.className, 'container mt-5')}>
        <h1 className="text-center text-2xl font-bold">
          Note not available right now!
        </h1>
      </section>
    );
  }
}
