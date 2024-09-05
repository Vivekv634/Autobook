'use client';
import { Notebook } from '@/app/components/Notebook';
import NoteBookSearchDialog from '@/app/components/NotebookSearchDialog';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NewNotebookDialog from '@/app/components/NewNotebookDialog';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
const NotebookComponent = () => {
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, [mount]);

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
                className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto cursor-pointer"
              >
                <span className="ml-2">Search notebooks...</span>
              </div>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="p-2">
                    <Plus />
                  </Button>
                </DialogTrigger>
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
                className="w-full rounded-md px-2 bg-neutral-100 dark:bg-neutral-900"
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
          <NewNotebookDialog />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotebookComponent;
