'use client';
import Note from '@/app/components/Note';
import NoteSkeleton from '@/app/components/NoteSkeleton';
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDeletedNotes,
  setNotes,
  setNoteUpdate,
  setNoteBooks,
} from '@/app/redux/slices/noteSlice';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NotesComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, isNoteUpdate } = useSelector((state) => state.note);
  const dispatch = useDispatch();
  const [notesDocID, setNotesDocID] = useState(null);
  const [notebooks, setNotebooks] = useState({});
  const router = useRouter();
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
      const dataResponse = await axios.get(`${process.env.API}/api/data`, {
        headers: {
          notesDocID: notesDocID,
        },
      });

      let temp = {};
      dataResponse.data.result.notebooks.map((notebook) => {
        temp[notebook.notebookID] = notebook.notebookName;
      });
      setNotebooks(temp);
      dispatch(setNoteBooks(temp));

      let sortedNotes = [];
      dataResponse.data.result.notes.map((note) => {
        if (!note.isTrash && !note.isLocked && note.isPinned) {
          sortedNotes.push(note);
        }
      });

      dataResponse.data.result.notes.map((note) => {
        if (!note.isTrash && !note.isLocked && !note.isPinned) {
          sortedNotes.push(note);
        }
      });
      dispatch(setNotes(sortedNotes));

      let filterDeletedNotes = [];
      dataResponse.data.result.notes.map((note) => {
        if (note.isTrash) {
          filterDeletedNotes.push(note);
        }
      });
      dispatch(setDeletedNotes(filterDeletedNotes));
    }

    if (notesDocID && call) {
      fetchData(notesDocID);
      setCall(false);
      console.log('fetch data from notes page...');
    }
  }, [notesDocID, notebooks, call, dispatch]);

  useEffect(() => {
    if (isNoteUpdate) {
      let updatedNotes = [];
      notes &&
        notes.map((note) => {
          if (!note.isTrash && !note.isLocked && note.isPinned) {
            updatedNotes.push(note);
          }
        });
      notes &&
        notes.map((note) => {
          if (!note.isTrash && !note.isLocked && !note.isPinned) {
            updatedNotes.push(note);
          }
        });
      dispatch(setNotes(updatedNotes));
      dispatch(setNoteUpdate(false));
    }
  }, [notes, dispatch, isNoteUpdate]);

  const createNote = async () => {
    try {
      let body = {
        title: `Note ${new Date().toString()}`,
      };
      const createResponse = await axios.post(
        `${process.env.API}/api/notes/create`,
        body,
        {
          headers: {
            notesDocID: notesDocID,
          },
        },
      );
      dispatch(setNotes(createResponse.data.result));
      toast({ description: 'Note created!', className: 'bg-green-400' });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! Something went wrong. Try again!',
        variant: 'descriptive',
      });
    }
  };

  if (notes.length) {
    return (
      <section className="p-2 flex flex-col">
        <Button
          className="fixed right-4 bottom-4 w-[4rem] h-[4rem] rounded-full"
          onClick={createNote}
        >
          <Plus className="h-[2.2rem] w-[2.2rem]" />
        </Button>
        {notes.length ? (
          notes.map((note, index) => {
            return (
              <Note
                key={index}
                note={note}
                notesDocID={notesDocID}
                notebook_name={notebooks[note.notesbook_ref_id]}
              />
            );
          })
        ) : (
          <>
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
            <NoteSkeleton />
          </>
        )}
      </section>
    );
  } else {
    return (
      <section className="p-2 flex flex-col justify-center h-full items-center text-center">
        <Label className="text-[2.7rem]">Empty here!</Label>
        <Label className="text-md">
          Click{' '}
          <span className="underline font-bold" onClick={createNote}>
            here
          </span>{' '}
          to create a new note now.
        </Label>
      </section>
    );
  }
};

export default NotesComponent;
