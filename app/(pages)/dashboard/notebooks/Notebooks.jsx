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
import NotebookNotFoundSVG from '@/public/notebook-not-found.svg';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import hotkeys from 'hotkeys-js';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

const NotebookComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);
  const [newNotebookDialog, setNewNotebookDialog] = useState(false);
  const [mount, setMount] = useState(false);

  hotkeys('ctrl+m, command+m', (e) => {
    e.preventDefault();
    setNewNotebookDialog(true);
  });

  hotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    setCommandOpen(true);
  });

  useEffect(() => {
    setMount(true);
  }, [mount]);

  return (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={newNotebookDialog} onOpenChange={setNewNotebookDialog}>
          <section className="p-2 flex flex-col">
            <div className="flex justify-between gap-1 mb-2">
              <div
                onClick={() => {
                  setCommandOpen(true);
                }}
                className="rounded-md border px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto cursor-pointer"
              >
                <span className="mx-2 cursor-pointer flex justify-between">
                  Search notebooks...
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
                  <Button className="px-3" aria-label="add notebook">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Add new notebook.(CTRL+M)</TooltipContent>
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
            {Object.keys(notebooks).length && (
              <Accordion
                collapsible="true"
                type="multiple"
                className="w-full bg-neutral-900 rounded-md px-2 border"
                defaultValue={Object.keys(notebooks)}
              >
                {Object.keys(notebooks).map((notebook_id) => {
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
            )}
          </section>
          <section className="flex justify-center items-center h-full">
            {Object.keys(notebooks).length == 0 && (
              <div className="flex text-center h-full justify-center items-center">
                <div>
                  <Image
                    src={NotebookNotFoundSVG}
                    alt="Notebook not created yet!"
                    loading="lazy"
                  />
                  <Label className="text-lg">Notebook not created yet!</Label>
                </div>
              </div>
            )}
          </section>
          <NewNotebookDialog />
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotebookComponent;
