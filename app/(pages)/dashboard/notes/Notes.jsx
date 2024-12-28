'use client';
import ManualGlobalSearchDialog from '@/app/components/ManualGlobalSearchDialog';
import NewNoteDialog from '@/app/components/NewNoteDialog';
import Note from '@/app/components/Note';
import NotesMoreToolsDropDownMenu from '@/app/components/NotesMoreToolsDropDownMenu';
import { useMediaHook } from '@/app/utils/mediaHook';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import NoteNotFoundSVG from '@/public/note-not-found.svg';
import hotkeys from 'hotkeys-js';
import { Ellipsis, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NotesComponent = () => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { notes, user, notebooks, notesView } = useSelector(
    (state) => state.note,
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesViewCSS, setNotesViewCSS] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [newNoteDialog, setNewNoteDialog] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setNotesViewCSS(
      notesView == 'rows'
        ? 'gap-3 px-2 md:px-0 flex flex-col'
        : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 grid',
    );
  }, [notesView]);

  hotkeys('ctrl+m, command+m', (e) => {
    e.preventDefault();
    setNewNoteDialog(true);
  });

  if (!isMounted) return null;

  return (
    <TooltipProvider>
      <section className="flex flex-col pt-2 mb-2 px-2">
        <div className="flex justify-between gap-2">
          <div
            onClick={() => setSearchOpen((open) => !open)}
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
          <Dialog open={newNoteDialog} onOpenChange={setNewNoteDialog}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger>
                  <Button className="h-11" aria-label="add note">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add new note (CTRL+M)</TooltipContent>
            </Tooltip>
            <NewNoteDialog />
          </Dialog>
          <NotesMoreToolsDropDownMenu>
            <Button variant="outline" className="h-11">
              <Ellipsis />
            </Button>
          </NotesMoreToolsDropDownMenu>
        </div>
      </section>
      <Separator className="my-4 hidden md:block" />
      <div className={notesViewCSS}>
        {notes.length != 0 &&
          notes.map((note, index) => {
            return (
              <Note
                key={index}
                index={index}
                note={note}
                notesDocID={user?.userData?.notesDocID}
                notebook_name={notebooks[note.notebook_ref_id]?.notebookName}
              />
            );
          })}
      </div>
      {notes.length == 0 && (
        <section className="flex justify-center items-center h-full">
          <div className="flex text-center justify-center align-center">
            <div>
              <Image
                src={NoteNotFoundSVG}
                alt="No notes created yet!"
                loading="lazy"
              />
              <Label className="text-lg">Note not created yet!</Label>
            </div>
          </div>
        </section>
      )}
      <ManualGlobalSearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </TooltipProvider>
  );
};

export default NotesComponent;
