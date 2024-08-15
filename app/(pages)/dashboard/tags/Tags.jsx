'use client';
import { setTagsData } from '@/app/redux/slices/noteSlice';
import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion } from '@/components/ui/accordion';
import Tag from '@/app/components/Tag';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import SearchDialog from '@/app/components/SearchDialog';

const TagsComponent = () => {
  const [notesDocID, setNotesDocID] = useState(null);
  const { notes, tagsData, notebooks } = useSelector((state) => state.note);
  const [mount, setMount] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setMount(true);
  }, [setMount]);

  useEffect(() => {
    if (hasCookie('user-session-data')) {
      const cookie = JSON.parse(getCookie('user-session-data'));
      setNotesDocID(cookie.userDoc.notesDocID);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${process.env.API}/api/notes`, {
        headers: {
          notesDocID: notesDocID,
        },
      });
      let tagData = {};
      if (notesDocID && mount) {
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
      }
      dispatch(setTagsData(tagData));
    }
    if (notesDocID && mount) {
      fetchData();
    }
  }, [dispatch, mount, notesDocID]);

  useEffect(() => {
    let tagData = {};
    if (notesDocID && mount) {
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
  }, [notes, dispatch, mount, notesDocID]);

  return (
    <section className="p-2 flex flex-col">
      <div
        onClick={() => {
          setCommandOpen(true);
        }}
        className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-1 py-2 mb-2 text-muted-foreground w-full"
      >
        <span className="ml-2">Search your tags...</span>
      </div>
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search your tags..." />
        <div className="m-3">
          <SearchDialog
            searchData={Object.keys(tagsData)}
            noFoundPrompt="No tags found."
            setOpen={setCommandOpen}
          />
        </div>
      </CommandDialog>
      {tagsData && notebooks && (
        <Accordion
          collapsible="true"
          type="multiple"
          className="w-full border rounded-md px-2 bg-neutral-100 dark:bg-neutral-900"
          defaultValue={Object.keys(tagsData)}
        >
          {Object.keys(tagsData).length != 0 &&
            Object.keys(tagsData).map((tag) => {
              return (
                <Tag
                  key={tag}
                  notesDocID={notesDocID}
                  notebooks={notebooks}
                  tagName={tag}
                  tagNotes={tagsData[tag]}
                />
              );
            })}
        </Accordion>
      )}
    </section>
  );
};

export default TagsComponent;
