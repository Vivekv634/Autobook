'use client';
import { Notebook } from '@/app/components/Notebook';
import NoteBookSearchDialog from '@/app/components/NotebookSearchDialog';
import {
  setDeletedNotes,
  setNoteBooks,
  setNotes,
  setTagsData,
} from '@/app/redux/slices/noteSlice';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
const NotebookComponent = () => {
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mount, setMount] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setMount(true);
  }, [mount]);

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
      console.log('fetch data from notebooks page...');
    }
  }, [dispatch, mount, user.userData?.notesDocID]);

  async function createNotebook() {
    try {
      const notebookResponse = await axios.post(
        `${process.env.API}/api/notebooks/create`,
        { notebookName: `Notebook ${Object.keys(notebooks).length + 1}` },
        {
          headers: {
            notesDocID: user.userData.notesDocID,
          },
        },
      );
      let newNotebooks = {};
      notebookResponse.data.result.map((notebook) => {
        newNotebooks[notebook.notebookID] = notebook.notebookName;
      });
      dispatch(setNoteBooks(newNotebooks));
      toast({
        description: 'New notebook created!',
        className: 'bg-green-400',
      });
    } catch (error) {
      console.error(error);
      toast({
        description: 'Oops! something went wrong. Try again later!',
        className: 'bg-red-400',
      });
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <section className="p-2 flex flex-col">
          <div className="flex justify-between gap-1 mb-2">
            <div
              onClick={() => {
                setCommandOpen(true);
              }}
              className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto cursor-pointer"
            >
              <span className="ml-2">Search notebooks...</span>
            </div>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                onClick={createNotebook}
                className="p-2"
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new notebook.</TooltipContent>
          </div>
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Search your notebooks..." />
            <div className="m-3">
              <NoteBookSearchDialog
                searchData={notebooks}
                noFoundPrompt="No notebooks found."
                setOpen={setCommandOpen}
              />
            </div>
          </CommandDialog>
          {notes && notebooks ? (
            <Accordion
              collapsible="true"
              type="multiple"
              className="w-full rounded-md px-2 bg-neutral-100 dark:bg-neutral-800"
              defaultValue={Object.keys(notebooks)}
            >
              {Object.keys(notebooks).length !== 0 &&
                Object.keys(notebooks).map((notebook_id) => {
                  const filteredNotes = notes.filter(
                    (note) => note.notebook_ref_id === notebook_id,
                  );
                  return (
                    <Notebook
                      notebooks={notebooks}
                      notes={filteredNotes}
                      notebook_id={notebook_id}
                      key={notebook_id}
                      notesDocID={user.userData.notesDocID}
                    />
                  );
                })}
            </Accordion>
          ) : (
            <div className="">No notebooks here.</div>
          )}
        </section>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotebookComponent;
