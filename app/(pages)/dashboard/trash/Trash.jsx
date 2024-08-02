"use client";
import Note from '@/app/components/Note';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setDeletedNotes } from '@/app/redux/slices/noteSlice';
import axios from 'axios';

const TrashComponent = () => {
  const { user } = useSelector(state => state.userLogin);
  const { deletedNotes, isDeletedNotes } = useSelector(state => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
  const router = useRouter();
  const [notebooks, setNotebooks] = useState({});
  const dispatch = useDispatch();
  const [call, setCall] = useState(true);

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setNotesDocID(cookie.userDoc.notesDocID);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchData(notesDocID) {
      const deletedNotesResponse = await axios.get(`${process.env.API}/api/notes/get-deleted-notes`, {
        headers: {
          notesDocID: notesDocID
        }
      })
      dispatch(setDeletedNotes(deletedNotesResponse.data.result));

      const notebookResponse = await axios.get(`${process.env.API}/api/notebooks`, {
        headers: {
          notesDocID: notesDocID
        }
      })

      let temp = {};
      notebookResponse.data.result.map(notebook => {
        temp[notebook.notebookID] = notebook.notebookName
      })
      setNotebooks(temp);
    }

    if (notesDocID && call) {
      fetchData(notesDocID);
      setCall(false);
    }
  }, [notesDocID, notebooks, dispatch, call]);

  return (
    <section className="p-2 flex flex-col">
      {isDeletedNotes && deletedNotes.map((note, index) => {
        return <Note key={index} note={note} notesDocID={notesDocID} notebook_name={notebooks[note.notesbook_ref_id]} />
      })}
    </section>
  )
}

export default TrashComponent;