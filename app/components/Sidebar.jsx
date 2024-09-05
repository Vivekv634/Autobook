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
      } else if (mount && Object.keys(user).length === 0) {
        fetchData(User.uid).then((notesDocID) => {
          const docRef = doc(db, 'notes', notesDocID);
          const unsubscribe = onSnapshot(docRef, (doc) => {
            const { notes, notebooks, autoNotes } = doc.data();
            let updatedNotes = [];
            let tagsData = {};
            let deletedNotes = [];

            notes?.map((note) => {
              if (!note.isTrash && !note.isLocked) {
                if (note.isPinned) {
                  updatedNotes.unshift(note);
                } else {
                  updatedNotes.push(note);
                }
                note.tagsList &&
                  note.tagsList.map((tag) => {
                    if (tagsData[tag]) {
                      tagsData[tag].push(note);
                    } else {
                      tagsData[tag] = [note];
                    }
                  });
              }
              if (note.isTrash) {
                deletedNotes.push(note);
              }
            });

            dispatch(setNotes(updatedNotes));
            dispatch(setTagsData(tagsData));
            dispatch(setDeletedNotes(deletedNotes));

            let Notebooks = {};
            notebooks?.map((notebook) => {
              Notebooks[notebook.notebookID] = {
                notebookName: notebook.notebookName,
                usedInTemplate: notebook.usedInTemplate,
              };
            });

            dispatch(setNoteBooks(Notebooks));
            dispatch(setAutoNotes(autoNotes));

            console.log('fetching data from snapshot...');
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
