'use client';
import TagsSearchDialog from '@/app/components/TagsSearchDialog';
import Tag from '@/app/components/Tag';
import { Accordion } from '@/components/ui/accordion';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const TagsComponent = () => {
  const { tagsData, notebooks, user } = useSelector((state) => state.note);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
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
      {tagsData && (
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
      {!tagsData && <div>No tags here.</div>}
    </section>
  );
};

export default TagsComponent;
