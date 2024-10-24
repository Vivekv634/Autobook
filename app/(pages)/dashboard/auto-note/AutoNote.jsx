'use client';
import AutoNote from '@/app/components/AutoNote';
import AutoNoteSearchDialog from '@/app/components/AutoNoteSearchDialog';
import NewAutoNoteDialog from '@/app/components/NewAutoNoteDialog';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import hotkeys from 'hotkeys-js';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import AutoNoteNotFoundSVG from '@/public/autonote-not-found.svg';

const AutoNoteComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const [commandOpen, setCommandOpen] = useState(false);
  const { autoNotes } = useSelector((state) => state.note);
  const [newAutoNoteDialog, setNewAutoNoteDialog] = useState(false);

  hotkeys('ctrl+m, command+m', (e) => {
    e.preventDefault();
    setNewAutoNoteDialog(true);
  });

  hotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    setCommandOpen(true);
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={newAutoNoteDialog} onOpenChange={setNewAutoNoteDialog}>
          <section className="p-2 flex flex-col">
            <div className="flex justify-between gap-1 mb-2">
              <div
                onClick={() => {
                  setCommandOpen(true);
                }}
                className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
              >
                <span className="mx-2 cursor-pointer flex justify-between">
                  Search autonotes...
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
                  <Button
                    variant="secondary"
                    className="p-2"
                    aria-label="add autonote"
                  >
                    <Plus />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add new note. (CTRL+M)</TooltipContent>
            </div>
            <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
              <CommandInput placeholder="Search your auto notes..." />
              <div className="m-3">
                <AutoNoteSearchDialog
                  searchData={autoNotes}
                  noFoundPrompt="No auto notes found."
                  setOpen={setCommandOpen}
                />
              </div>
            </CommandDialog>
            {autoNotes?.length > 0 &&
              autoNotes.map((autoNote, index) => {
                return <AutoNote key={index} autoNote={autoNote} />;
              })}
            {autoNotes?.length == 0 && (
              <div className="flex text-center h-inherit justify-center align-center">
                <div>
                  <Image
                    src={AutoNoteNotFoundSVG}
                    alt="AutoNote not created yet!"
                    loading="lazy"
                  />
                  <Label className="text-lg">AutoNote not created yet!</Label>
                </div>
              </div>
            )}
          </section>
          <NewAutoNoteDialog />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoNoteComponent;
