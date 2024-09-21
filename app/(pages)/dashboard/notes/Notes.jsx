'use client';
import NewNoteDialog from '@/app/components/NewNoteDialog';
import Note from '@/app/components/Note';
import NoteSearchDialog from '@/app/components/NoteSearchDialog';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import hotkeys from 'hotkeys-js';

const NotesComponent = () => {
  const { notes, user, notebooks } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);
  const [newNoteDialog, setNewNoteDialog] = useState(false);

  hotkeys('ctrl+m, command+m', (e) => {
    e.preventDefault();
    setNewNoteDialog(true);
  });

  hotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    setCommandOpen(true);
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={newNoteDialog} onOpenChange={setNewNoteDialog}>
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
                <DialogTrigger asChild>
                  <Button variant="secondary" className="p-2">
                    <Plus />
                  </Button>
                </DialogTrigger>
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
            {notes.length > 0 &&
              notes.map((note, index) => {
                return (
                  <Note
                    key={index}
                    note={note}
                    notesDocID={user.userData.notesDocID}
                    notebook_name={
                      notebooks[note.notebook_ref_id]?.notebookName
                    }
                  />
                );
              })}
            {notes.length == 0 && <div> No Notes created yet.</div>}
          </section>
          <NewNoteDialog />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotesComponent;
