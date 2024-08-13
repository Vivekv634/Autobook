'use client';
import Note from '@/app/components/Note';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeDeletedNotes,
  setNotes,
  setDeletedNotes,
} from '@/app/redux/slices/noteSlice';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const TrashComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { deletedNotes } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
  const router = useRouter();
  const [notebooks, setNotebooks] = useState({});
  const dispatch = useDispatch();
  const [call, setCall] = useState(true);
  const { toast } = useToast();

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
      const deletedNotesResponse = await axios.get(
        `${process.env.API}/api/notes/get-deleted-notes`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setDeletedNotes(deletedNotesResponse.data.result));

      const notebookResponse = await axios.get(
        `${process.env.API}/api/notebooks`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );

      let temp = {};
      notebookResponse.data.result.map((notebook) => {
        temp[notebook.notebookID] = notebook.notebookName;
      });
      setNotebooks(temp);
    }

    if (notesDocID && call) {
      fetchData(notesDocID);
      setCall(false);
    }
  }, [notesDocID, notebooks, dispatch, call]);

  const restoreAll = async () => {
    try {
      const restoreResponse = await axios.get(
        `${process.env.API}/api/notes/restoreall`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(restoreResponse.data.result));
      dispatch(removeDeletedNotes([]));
      toast({ description: 'All notes restored!' });
    } catch (error) {
      console.log(error);
      toast({ description: 'Something went wrong! Try again later.' });
    }
  };

  const deleteAll = async () => {
    try {
      const deleteResponse = await axios.delete(
        `${process.env.API}/api/notes/deleteall`,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(deleteResponse.data.result));
      dispatch(removeDeletedNotes());
      toast({ description: deleteResponse.data.result });
    } catch (error) {
      console.log(error);
      toast({ description: 'Something went wrong! Try again later.' });
    }
  };

  return (
    <section className="p-2 flex flex-col">
      {console.log(deletedNotes)}
      {deletedNotes == [] && (
        <div className="flex justify-around">
          <Button className="w-[47%]" onClick={restoreAll}>
            Restore all
          </Button>
          <Button className="w-[47%]" onClick={deleteAll} variant="destructive">
            Delete All
          </Button>
        </div>
      )}
      {deletedNotes == [] &&
        deletedNotes.map((note, index) => {
          return (
            <Note
              key={index}
              note={note}
              notesDocID={notesDocID}
              notebook_name={notebooks[note.notesbook_ref_id]}
            />
          );
        })}
      {deletedNotes != [] && (
        <div className="flex items-center justify-between h-screen w-full text-3xl">
          Empty bin!
        </div>
      )}
    </section>
  );
};

export default TrashComponent;
