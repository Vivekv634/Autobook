'use client';
import {
  setAutoNotes,
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setTagsData,
  setUser,
} from '@/app/redux/slices/noteSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase.config';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';

const Menubar = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [mount, setMount] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.note);

  useEffect(() => {
    setMount(true);
  }, [mount]);

  useEffect(() => {
    const fetchData = async (authID) => {
      const response = await axios.get(
        `${process.env.API}/api/account/user/${authID}`,
      );
      if (response?.data?.result) {
        dispatch(setUser(response?.data?.result));
        return response?.data?.result?.userData?.notesDocID;
      }
    };
    onAuthStateChanged(auth, (User) => {
      if (!User) {
        router.push('/login');
      } else if (mount && Object.keys(user).length == 0) {
        fetchData(User.uid).then((notesDocID) => {
          const docRef = doc(db, 'notes', notesDocID);
          const unsubscribe = onSnapshot(docRef, (doc) => {
            const { notes, notebooks, autoNotes } = doc.data();

            let updatedNotes = [];
            notes?.map((note) => {
              if (!note.isTrash && !note.isLocked && note.isPinned) {
                updatedNotes.push(note);
              }
            });
            notes?.map((note) => {
              if (!note.isTrash && !note.isLocked && !note.isPinned) {
                updatedNotes.push(note);
              }
            });
            dispatch(setNotes(updatedNotes));

            let tagData = {};
            notes?.map((note) => {
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

            let Notebooks = {};
            notebooks.map((notebook) => {
              Notebooks[notebook.notebookID] = {
                notebookName: notebook.notebookName,
                usedInTemplate: notebook.usedInTemplate,
              };
            });
            dispatch(setNoteBooks(Notebooks));

            let filterDeletedNotes = [];
            notes.map((note) => {
              if (note.isTrash) {
                filterDeletedNotes.push(note);
              }
            });
            dispatch(setDeletedNotes(filterDeletedNotes));

            dispatch(setAutoNotes(autoNotes));
            console.log('fetching data from snap shot...');
          });
          return () => unsubscribe();
        });
      }
    });
  }, [dispatch, mount, router, user]);

  if (isDesktop) {
    return <DesktopSidebar />;
  }

  return <MobileSidebar />;
};

export default Menubar;
