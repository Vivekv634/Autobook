'use client';
import { Notebook } from '@/app/components/Notebook';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
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
import { useMediaHook } from '@/app/utils/mediaHook';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import ManualGlobalSearchDialog from '@/app/components/ManualGlobalSearchDialog';
import hotkeys from 'hotkeys-js';

const NotebookComponent = () => {
  const isDesktop = useMediaHook({screenWidth: 768});
  const { notes, notebooks, user } = useSelector((state) => state.note);
  const [mount, setMount] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [newNotebookOpen, setNewNotebookOpen] = useState(false);

  hotkeys('ctrl+m, command+m', (e) => {
    e.preventDefault();
    setNewNotebookOpen(true);
  });
  useEffect(() => {
    setMount(true);
  }, [mount]);

  return (
    <TooltipProvider>
      <Tooltip>
        <section className="p-2 flex flex-col">
          <div className="flex justify-between gap-1 mb-2">
            <div
              onClick={() => setSearchOpen((open) => !open)}
              className="rounded-md border px-1 py-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto cursor-pointer"
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
              <Button className="h-11" aria-label="add notebook">
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add new notebook.(CTRL+M)</TooltipContent>
          </div>
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
                    notesDocID={user?.userData?.notesDocID}
                  />
                );
              })}
            </Accordion>
          )}
        </section>
        {Object.keys(notebooks).length == 0 && (
          <section className="flex justify-center items-center h-full">
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
          </section>
        )}
        <NewNotebookDialog
          open={newNotebookOpen}
          setOpen={setNewNotebookOpen}
        />
        <ManualGlobalSearchDialog open={searchOpen} setOpen={setSearchOpen} />
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotebookComponent;
