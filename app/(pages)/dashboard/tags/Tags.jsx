'use client';
import TagsSearchDialog from '@/app/components/TagsSearchDialog';
import Tag from '@/app/components/Tag';
import { Accordion } from '@/components/ui/accordion';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import hotkeys from 'hotkeys-js';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import TagNotFoundSVG from '@/public/tag-not-found.svg';

const TagsComponent = () => {
  const { tagsData, notebooks, user } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);

  hotkeys('ctrl+k, command+k', (e) => {
    e.preventDefault();
    setCommandOpen(true);
  });

  return (
    <>
      <section className="p-2 flex flex-col">
        <div
          onClick={() => {
            setCommandOpen(true);
          }}
          className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 mb-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
        >
          <span className="ml-2 cursor-pointer">Search your tags...</span>
        </div>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Search your tags..." />
          <div className="m-3">
            <TagsSearchDialog
              searchData={Object.keys(tagsData)}
              noFoundPrompt="No tags found."
              setOpen={setCommandOpen}
            />
          </div>
        </CommandDialog>
        {Object.keys(tagsData).length > 0 && (
          <Accordion
            collapsible="true"
            type="multiple"
            className="w-full rounded-md px-2 bg-neutral-100 dark:bg-neutral-900"
            defaultValue={Object.keys(tagsData)}
          >
            {Object.keys(tagsData).length !== 0 &&
              Object.keys(tagsData).map((tag) => (
                <Tag
                  key={tag}
                  notesDocID={user.userData.notesDocID}
                  notebooks={notebooks}
                  tagName={tag}
                  tagNotes={tagsData[tag]}
                />
              ))}
          </Accordion>
        )}
      </section>
      <section className="flex justify-center items-center h-full">
        {Object.keys(tagsData).length == 0 && (
          <div className="flex text-center h-inherit justify-center align-center">
            <div>
              <Image
                src={TagNotFoundSVG}
                alt="No notes created yet!"
                loading="lazy"
              />
              <Label className="text-lg">Note not created yet!</Label>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default TagsComponent;
