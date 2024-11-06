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
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase.config';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';

const Menubar = () => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const [mount, setMount] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.note);

  useEffect(() => setMount(true), []);

  const processNotesData = useMemo(() => {
    return (notes) => {
      const updatedNotes = [];
      const deletedNotes = [];
      const tagsData = {};

      notes?.forEach((note) => {
        if (!note.isTrash) {
          // Only include non-trash notes in updatedNotes
          if (note.isPinned) updatedNotes.unshift(note);
          else updatedNotes.push(note);

          // Process tags data
          note.tagsList?.forEach((tag) => {
            if (!tagsData[tag]) tagsData[tag] = [];
            tagsData[tag].push(note);
          });
        } else {
          // Include trash notes only in deletedNotes
          deletedNotes.push(note);
        }
      });

      return { updatedNotes, deletedNotes, tagsData };
    };
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
          const { updatedNotes, deletedNotes, tagsData } =
            processNotesData(notes);

          // Dispatch Redux actions with separated notes
          dispatch(setTrashInterval(trashInterval));
          dispatch(setNotes(updatedNotes)); // Only non-trash notes here
          dispatch(setDeletedNotes(deletedNotes)); // Only trash notes here
          dispatch(setTagsData(tagsData));

          // Process notebooks
          const Notebooks = notebooks.reduce((acc, notebook) => {
            acc[notebook.notebookID] = {
              notebookName: notebook.notebookName,
              usedInTemplate: notebook.usedInTemplate,
            };
            return acc;
          }, {});
          dispatch(setNoteBooks(Notebooks));
          dispatch(setAutoNotes(autoNotes));
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
        }
      });
      return unSubscribe;
    };

    onAuthStateChanged(auth, (User) => {
      if (!User) {
        router.push('/login');
      } else if (mount && user && Object.keys(user).length === 0) {
        fetchUserData(User.uid).then((response) => {
          const notesDocID = response.userData.notesDocID;
          const unsubscribeNotes = listenToNotes(notesDocID);
          const unsubscribeUser = listenToUser(response.userID);

          return () => {
            unsubscribeNotes();
            unsubscribeUser();
          };
        });
      }
    });
  }, [dispatch, mount, processNotesData, router, user]);

  return isDesktop ? <DesktopSidebar /> : <MobileSidebar />;
};

export default Menubar;
