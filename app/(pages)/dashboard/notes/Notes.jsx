'use client';
import Note from '@/app/components/Note';
import NoteSearchDialog from '@/app/components/NoteSearchDialog';
import {
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setNoteUpdate,
  setTagsData,
} from '@/app/redux/slices/noteSlice';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NotesComponent = () => {
  const { notes, isNoteUpdate, user, notebooks } = useSelector(
    (state) => state.note,
  );
  const [mount, setMount] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setMount(true);
  }, [setMount]);

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

    if (user.userData?.notesDocID && mount) {
      fetchData(user.userData.notesDocID);
      setMount(false);
      console.log('fetch data from notes page...');
    }
  }, [user.userData?.notesDocID, mount, dispatch]);

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
      let tagData = {};
      notes.data.result.notes.map((note) => {
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
            notesDocID: user.userData.notesDocID,
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
      <TooltipProvider>
        <Tooltip>
          <section className="p-2 flex flex-col">
            <div className="flex justify-between gap-1 mb-2">
              <div
                onClick={() => {
                  setCommandOpen(true);
                }}
                className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
              >
                <span className="ml-2 cursor-pointer">Search notes...</span>
              </div>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={createNote}
                  className="p-2"
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new note.</TooltipContent>
            </div>
            <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
              <CommandInput placeholder="Search your notes..." />
              <div className="m-3">
                <NoteSearchDialog
                  searchData={notes}
                  noFoundPrompt="No notes found."
                  setOpen={setCommandOpen}
                />
              </div>
            </CommandDialog>
            {notes &&
              notes.map((note, index) => {
                return (
                  <Note
                    key={index}
                    note={note}
                    notesDocID={user.userData.notesDocID}
                    notebook_name={notebooks[note.notebook_ref_id]}
                  />
                );
              })}
          </section>
        </Tooltip>
      </TooltipProvider>
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
