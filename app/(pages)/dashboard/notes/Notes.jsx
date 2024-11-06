'use client';
import NewNoteDialog from '@/app/components/NewNoteDialog';
import Note from '@/app/components/Note';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Ellipsis, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaHook } from '@/app/utils/mediaHook';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import NoteNotFoundSVG from '@/public/note-not-found.svg';
import { Label } from '@/components/ui/label';
import ManualGlobalSearchDialog from '@/app/components/ManualGlobalSearchDialog';
import hotkeys from 'hotkeys-js';
import { Separator } from '@/components/ui/separator';
import NotesMoreToolsDropDownMenu from '@/app/components/NotesMoreToolsDropDownMenu';

const NotesComponent = () => {
  const isDesktop = useMediaHook({ screenWidth: 768 });
  const { notes, user, notebooks, notesView } = useSelector(
    (state) => state.note,
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [openNewNote, setOpenNewNote] = useState(false);
  const [notesViewCSS, setNotesViewCSS] = useState('');

  hotkeys('ctrl+m, window+m, command+m', (e) => {
    e.preventDefault();
    setOpenNewNote(true);
  });

  useEffect(() => {
    setNotesViewCSS(
      notesView == 'rows'
        ? 'gap-4 px-2 md:px-0 flex flex-col'
        : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 grid',
    );
  }, [notesView]);

  return (
    <TooltipProvider>
      <section className="flex flex-col p-2">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setOpenNewNote((open) => !open)}
                className="h-11"
                aria-label="add note"
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new note.(CTRL+M)</TooltipContent>
          </Tooltip>
          <NotesMoreToolsDropDownMenu>
            <Button variant="outline" className="h-11">
              <Ellipsis />
            </Button>
          </NotesMoreToolsDropDownMenu>
        </div>
      </section>
      <Separator className="my-4 hidden md:block" />
      <div className={notesViewCSS}>
        {notes.length > 0 &&
          notes.map((note, index) => {
            return (
              <Note
                key={index}
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
      <NewNoteDialog open={openNewNote} setOpen={setOpenNewNote} />
      <ManualGlobalSearchDialog open={searchOpen} setOpen={setSearchOpen} />
    </TooltipProvider>
  );
};

export default NotesComponent;
