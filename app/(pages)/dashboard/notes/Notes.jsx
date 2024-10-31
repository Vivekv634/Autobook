'use client';
import NewNoteDialog from '@/app/components/NewNoteDialog';
import Note from '@/app/components/Note';
import { Button } from '@/components/ui/button';
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
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import NoteNotFoundSVG from '@/public/note-not-found.svg';
import { Label } from '@/components/ui/label';
import ManualGlobalSearchDialog from '@/app/components/ManualGlobalSearchDialog';

const NotesComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { notes, user, notebooks } = useSelector((state) => state.note);
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={newNoteDialog} onOpenChange={setNewNoteDialog}>
          <section className="p-2 flex flex-col">
            <div className="flex justify-between gap-1 mb-2">
              <div
                onClick={() => setOpen((open) => !open)}
                className="rounded-md border px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
              >
                <span className="mx-2 cursor-pointer flex justify-between">
                  Search
                  <code
                    className={cn(
                      !isDesktop && 'hidden',
                      'px-1 border rounded-md text-center',
                    )}
                  >
                    CTRL+K
                  </code>
                </span>
              </div>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button className="px-3" aria-label="add note">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add new note.(CTRL+M)</TooltipContent>
            </div>
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
          </section>
          <section className="flex justify-center items-center h-full">
            {notes.length == 0 && (
              <div className="flex text-center h-inherit justify-center align-center">
                <div>
                  <Image
                    src={NoteNotFoundSVG}
                    alt="No notes created yet!"
                    loading="lazy"
                  />
                  <Label className="text-lg">Note not created yet!</Label>
                </div>
              </div>
            )}
          </section>
          <NewNoteDialog />
          <ManualGlobalSearchDialog open={open} setOpen={setOpen} />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotesComponent;
