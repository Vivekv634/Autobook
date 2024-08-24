'use client';
import TagsSearchDialog from '@/app/components/TagsSearchDialog';
import Tag from '@/app/components/Tag';
import { setTagsData } from '@/app/redux/slices/noteSlice';
import { Accordion } from '@/components/ui/accordion';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TagsComponent = () => {
  const { notes, tagsData, notebooks, user } = useSelector(
    (state) => state.note,
  );
  const [mount, setMount] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setMount(true);
  }, [setMount]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${process.env.API}/api/notes`, {
        headers: {
          notesDocID: user.userData.notesDocID,
        },
      });
      let tagData = {};
      response.data.result.map((note) => {
        note.tagsList.length != 0 &&
          note.tagsList.map((tag) => {
            if (Object.keys(tagData).includes(tag)) {
              tagData[tag] = [...tagData[tag], note];
            } else {
              tagData[tag] = [note];
            }
          });
      });
      dispatch(setTagsData(tagData));
    }
    if (user.userData?.notesDocID && mount) {
      fetchData();
      setMount(false);
      console.log('fetch data from tags page...');
    }
  }, [dispatch, mount, user.userData?.notesDocID]);

  useEffect(() => {
    let tagData = {};
    if (user.userData?.notesDocID && mount) {
      notes.map((note) => {
        note.tagsList.length != 0 &&
          note.tagsList.map((tag) => {
            if (Object.keys(tagData).includes(tag)) {
              tagData[tag] = [...tagData[tag], note];
            } else {
              tagData[tag] = [note];
            }
          });
      });
    }
    dispatch(setTagsData(tagData));
  }, [notes, dispatch, mount, user.userData?.notesDocID]);

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
      {tagsData && notebooks ? (
        <Accordion
          collapsible="true"
          type="multiple"
          className="w-full rounded-md px-2 bg-neutral-100 dark:bg-neutral-900"
          defaultValue={Object.keys(tagsData)}
        >
          {Object.keys(tagsData).length != 0 &&
            Object.keys(tagsData).map((tag) => {
              return (
                <Tag
                  key={tag}
                  notesDocID={user.userData.notesDocID}
                  notebooks={notebooks}
                  tagName={tag}
                  tagNotes={tagsData[tag]}
                />
              );
            })}
        </Accordion>
      ) : (
        <div className="">No tags here.</div>
      )}
    </section>
  );
};

export default TagsComponent;
