'use client';
import Note from '@/app/components/Note';
import NoteSkeleton from '@/app/components/NoteSkeleton';
import SearchDialog from '@/app/components/SearchDialog';
import {
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setNoteUpdate,
} from '@/app/redux/slices/noteSlice';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const NotesComponent = () => {
  const { user } = useSelector((state) => state.userLogin);
  const { notes, isNoteUpdate } = useSelector((state) => state.note);
  const [notesDocID, setNotesDocID] = useState(null);
  const [notebooks, setNotebooks] = useState({});
  const [mount, setMount] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setMount(true);
  }, [setMount]);

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

    if (notesDocID && mount) {
      fetchData(notesDocID);
      setMount(false);
      console.log('fetch data from notes page...');
    }
  }, [notesDocID, notebooks, mount, dispatch]);

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
              <TooltipTrigger>
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
                <SearchDialog
                  searchData={notes}
                  noFoundPrompt="No notes found."
                  setOpen={setCommandOpen}
                />
              </div>
            </CommandDialog>
            {notes.length ? (
              notes.map((note, index) => {
                return (
                  <Note
                    key={index}
                    note={note}
                    notesDocID={notesDocID}
                    notebook_name={notebooks[note.notebook_ref_id]}
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
