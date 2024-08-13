'use client';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Note from '@/app/components/Note';
import axios from 'axios';
import { setNoteBooks, setNotes } from '@/app/redux/slices/noteSlice';
import { AccordionHeader } from '@radix-ui/react-accordion';
import { Ellipsis, Trash2, Pen } from 'lucide-react';

const NotebookComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, notebooks } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
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
    async function fetchData() {
      const dataResponse = await axios.get(`${process.env.API}/api/data`, {
        headers: {
          notesDocID: notesDocID,
        },
      });
      let temp = {};
      dispatch(setNotes(dataResponse.data.result.notes));
      dataResponse.data.result.notebooks.forEach((notebook) => {
        temp[notebook.notebookID] = notebook.notebookName;
      });
      dispatch(setNoteBooks(temp));
    }
    if (notesDocID) {
      fetchData();
      console.log('fetch data from notebook page...');
    }
  }, [dispatch, notesDocID]);

  function DeleteAlertDialog({ children }) {
    return (
      <AlertDialog onClick={(e) => e.stopPropagation()}>
        <AlertDialogTrigger
          className="text-red-400 flex justify-between w-44 pr-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader onClick={(e) => e.stopPropagation()}>
            <AlertDialogTitle onClick={(e) => e.stopPropagation()}>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription onClick={(e) => e.stopPropagation()}>
              This action cannot be undone. This will permanently delete the
              notebook, but doesn&apos;t delete your notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter onClick={(e) => e.stopPropagation()}>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={(e) => e.stopPropagation()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // TODO: add edit note feature
  function EditNodeAlertDialog({ children }) {
    return (
      <AlertDialog onClick={(e) => e.stopPropagation()}>
        <AlertDialogTrigger
          className="flex justify-between w-44 pr-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </AlertDialogTrigger>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          {/* <AlertDialogHeader onClick={(e) => e.stopPropagation()}> */}
          {/*   <AlertDialogTitle onClick={(e) => e.stopPropagation()}> */}
          {/*     Edit title */}
          {/*   </AlertDialogTitle> */}
          {/*   <AlertDialogDescription onClick={(e) => e.stopPropagation()}> */}
          {/*     Edit your notebook here. Save changes when you are done. */}
          {/*   </AlertDialogDescription> */}
          {/* </AlertDialogHeader> */}
          {/* <AlertDialogFooter onClick={(e) => e.stopPropagation()}> */}
          {/*   <AlertDialogCancel onClick={(e) => e.stopPropagation()}> */}
          {/*     Cancel */}
          {/*   </AlertDialogCancel> */}
          {/*   <AlertDialogAction onClick={(e) => e.stopPropagation()}> */}
          {/*     Save */}
          {/*   </AlertDialogAction> */}
          {/* </AlertDialogFooter> */}
          <AlertDialogDescription>Working on it.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <section className="p-2 flex flex-col">
      {notes && notebooks ? (
        <Accordion
          collapsible="true"
          type="multiple"
          className="w-full border rounded-md px-2"
          defaultValue={Object.keys(notebooks)}
        >
          {Object.keys(notebooks).length !== 0 &&
            Object.keys(notebooks).map((notebook_id) => {
              const filteredNotes = notes.filter(
                (note) => note.notebook_ref_id === notebook_id,
              );
              return (
                <AccordionItem key={notebook_id} value={notebook_id}>
                  <AccordionHeader className="flex justify-between px-1 items-center w-full">
                    <AccordionTrigger className="min-w-full mr-2">
                      {notebooks[notebook_id]}
                    </AccordionTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="min-h-7 min-w-9 border rounded-md" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-2">
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <EditNodeAlertDialog>
                            Edit Name <Pen className="w-4 h-4" />
                          </EditNodeAlertDialog>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <DeleteAlertDialog>
                            Delete notebook <Trash2 className="w-4 h-4" />
                          </DeleteAlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </AccordionHeader>
                  <AccordionContent>
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note, index) => (
                        <Note
                          key={index}
                          notesDocID={notesDocID}
                          notebook_name={notebooks[notebook_id]}
                          note={note}
                        />
                      ))
                    ) : (
                      <div className="">No notes here.</div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      ) : (
        <div className="">No notebooks here.</div>
      )}
    </section>
  );
};

export default NotebookComponent;
