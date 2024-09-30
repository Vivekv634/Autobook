'use client';
import {
  setAutoNotes,
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setTagsData,
  setTrashInterval,
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
  }, []);

  useEffect(() => {
    const fetchUserData = async (userID) => {
      try {
        const response = await axios.get(
          `${process.env.API}/api/account/user/${userID}`,
        );
        if (response?.data?.result) {
          dispatch(setUser(response?.data?.result));
          return response?.data?.result;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const listenToNotes = (notesDocID) => {
      const docRef = doc(db, 'notes', notesDocID);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const { notes, notebooks, autoNotes, trashInterval } = doc.data();

          // Processing notes
          let updatedNotes = [];
          let tagsData = {};
          let deletedNotes = [];

          notes?.forEach((note) => {
            if (!note.isTrash && !note.isLocked) {
              if (note.isPinned) {
                updatedNotes.unshift(note);
              } else {
                updatedNotes.push(note);
              }

              // Process tags data
              note.tagsList?.forEach((tag) => {
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

          // Dispatch Redux actions
          dispatch(setTrashInterval(trashInterval));
          dispatch(setNotes(updatedNotes));
          dispatch(setTagsData(tagsData));
          dispatch(setDeletedNotes(deletedNotes));

          // Process notebooks
          let Notebooks = {};
          notebooks?.forEach((notebook) => {
            Notebooks[notebook.notebookID] = {
              notebookName: notebook.notebookName,
              usedInTemplate: notebook.usedInTemplate,
            };
          });
          dispatch(setNoteBooks(Notebooks));
          dispatch(setAutoNotes(autoNotes));

          console.log('Fetched data from notes snapshot...');
        }
      });

      return unsubscribe;
    };

    const listenToUser = (userID) => {
      const docRef = doc(db, 'users', userID);
      const unSubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          dispatch(setUser({ userData, userID }));
          console.log('Fetched data from user snapshot...');
        }
      });
      return unSubscribe;
    };

    onAuthStateChanged(auth, (User) => {
      if (!User) {
        router.push('/login');
      } else if (mount && user && Object.keys(user).length === 0) {
        // Fetch user data and set up listeners
        fetchUserData(User.uid).then((response) => {
          const notesDocID = response.userData.notesDocID;

          // Set up listeners for both notes and user data
          const unsubscribeNotes = listenToNotes(notesDocID);
          const unsubscribeUser = listenToUser(response.userID);

          return () => {
            unsubscribeNotes();
            unsubscribeUser();
          };
        });
      }
    });
  }, [dispatch, mount, router, user]);

  // Render DesktopSidebar or MobileSidebar based on screen size
  if (isDesktop) {
    return <DesktopSidebar />;
  }

  return <MobileSidebar />;
};

export default Menubar;
