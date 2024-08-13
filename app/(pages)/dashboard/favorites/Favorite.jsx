'use client';
import Note from '@/app/components/Note';
import { setNoteUpdate } from '@/app/redux/slices/noteSlice';
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FavoriteComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, notebooks, isNoteUpdate } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
  const [favoriteNotes, setFavoriteNotes] = useState(
    notes.filter((note) => note.isFavorite),
  );
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setNotesDocID(cookie.userDoc.notesDocID);
    } else {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchNotes() {
      const notesResponse = await axios.get(`${process.env.API}/api/notes`, {
        headers: {
          notesDocID: notesDocID,
        },
      });
      setFavoriteNotes(
        notesResponse.data.result.filter((note) => note.isFavorite),
      );
    }
    if (notesDocID) {
      fetchNotes();
      console.log('fetching notes from favorite page...');
    }
  }, [notesDocID]);

  useEffect(() => {
    if (isNoteUpdate) {
      setFavoriteNotes(notes.filter((note) => note.isFavorite));
      dispatch(setNoteUpdate(false));
    }
  }, [isNoteUpdate, notes, dispatch]);

  return (
    <div>
      {favoriteNotes.map((note, index) => {
        return (
          <Note
            key={index}
            note={note}
            notesDocID={notesDocID}
            notebook_name={notebooks[note.notebook_ref_id]}
          />
        );
      })}
    </div>
  );
};

export default FavoriteComponent;
