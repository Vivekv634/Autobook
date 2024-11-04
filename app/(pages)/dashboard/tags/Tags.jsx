'use client';
import Tag from '@/app/components/Tag';
import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import TagNotFoundSVG from '@/public/tag-not-found.svg';
import ManualGlobalSearchDialog from '@/app/components/ManualGlobalSearchDialog';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';

const TagsComponent = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { tagsData, notebooks, user } = useSelector((state) => state.note);
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="p-2 flex flex-col">
        <div
          onClick={() => setOpen((open) => !open)}
          className="rounded-md border px-1 py-2 mb-2 text-muted-foreground w-full lg:max-w-80 lg:ml-auto"
        >
          <span className="ml-2 flex justify-between cursor-pointer">
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
        {Object.keys(tagsData).length > 0 && (
          <Accordion
            collapsible="true"
            type="multiple"
            className="w-full rounded-md px-2 bg-neutral-900"
            defaultValue={Object.keys(tagsData)}
          >
            {Object.keys(tagsData).length !== 0 &&
              Object.keys(tagsData).map((tag) => (
                <Tag
                  key={tag}
                  notesDocID={user?.userData?.notesDocID}
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
      <ManualGlobalSearchDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default TagsComponent;
