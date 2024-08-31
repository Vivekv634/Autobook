'use client';
import AutoNote from '@/app/components/AutoNote';
import AutoNoteSearchDialog from '@/app/components/AutoNoteSearchDialog';
import NewAutoNoteDialog from '@/app/components/NewAutoNoteDialog';
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

const AutoNoteComponent = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const { autoNotes } = useSelector((state) => state.note);

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog>
          <section className="p-2 flex flex-col">
            <div className="flex justify-between gap-1 mb-2">
              <div
                onClick={() => {
                  setCommandOpen(true);
                }}
                className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
              >
                <span className="ml-2 cursor-pointer">
                  Search auto notes...
                </span>
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
              <CommandInput placeholder="Search your auto notes..." />
              <div className="m-3">
                <AutoNoteSearchDialog
                  searchData={autoNotes}
                  noFoundPrompt="No auto notes found."
                  setOpen={setCommandOpen}
                />
              </div>
            </CommandDialog>
            {autoNotes.length != 0 ? (
              autoNotes.map((autoNote, index) => {
                return <AutoNote key={index} autoNote={autoNote} />;
              })
            ) : (
              <div>No Auto notes created yet.</div>
            )}
          </section>
          <NewAutoNoteDialog />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AutoNoteComponent;
