'use client';
import Note from '@/app/components/Note';
import NoteSearchDialog from '@/app/components/NoteSearchDialog';
import { setNotes } from '@/app/redux/slices/noteSlice';
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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NotesComponent = () => {
  const { notes, user, notebooks } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

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
                    notebook_name={notebooks[note.notebook_ref_id].notebookName}
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
