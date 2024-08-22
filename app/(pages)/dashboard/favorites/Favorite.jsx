'use client';
import Note from '@/app/components/Note';
import {
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setNoteUpdate,
  setTagsData,
} from '@/app/redux/slices/noteSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FavoriteComponent = () => {
  const { notes, notebooks, isNoteUpdate, user } = useSelector(
    (state) => state.note,
  );
  const [favoriteNotes, setFavoriteNotes] = useState(
    notes.filter((note) => note.isFavorite),
  );
  const dispatch = useDispatch();

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
      dispatch(setNoteBooks(temp));

      let tagData = {};
      dataResponse.data.result.notes.map((note) => {
        note.tagsList.length != 0 &&
          note.tagsList.map((tag) => {
            if (Object.keys(tagData).includes(tag)) {
              tagData[tag] = [...tagData[tag], note];
            } else {
              tagData[tag] = [note];
            }
          });
      });
      dispatch(setTagsData(tagData));

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

    if (user.userData.notesDocID) {
      fetchData(user.userData.notesDocID);
      console.log('fetch data from Favorites page...');
    }
  }, [dispatch, user.userData.notesDocID]);

  useEffect(() => {
    if (isNoteUpdate) {
      setFavoriteNotes(notes.filter((note) => note.isFavorite));
      dispatch(setNoteUpdate(false));
    }
  }, [isNoteUpdate, notes, dispatch]);

  return (
    <section className="p-2 flex flex-col">
      {favoriteNotes.length ? (
        favoriteNotes.map((note, index) => {
          return (
            <Note
              key={index}
              note={note}
              notesDocID={user.userData.notesDocID}
              notebook_name={notebooks[note.notebook_ref_id]}
            />
          );
        })
      ) : (
        <div className="">No favorite notes here.</div>
      )}
    </section>
  );
};

export default FavoriteComponent;
