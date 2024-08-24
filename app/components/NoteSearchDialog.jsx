'use client';
import React from 'react';

import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorNote } from '../redux/slices/noteSlice';

export default function NoteSearchDialog({
  searchData,
  noFoundPrompt,
  setOpen,
}) {
  const { user } = useSelector((state) => state.note);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleOnClickCommandItem = (noteData) => {
    dispatch(setEditorNote(noteData));
    router.push(`/dashboard/${user?.userData?.notesDocID}/${noteData.noteID}`);
    setOpen(false);
  };
  return (
    <CommandList>
      <CommandEmpty>{noFoundPrompt}</CommandEmpty>
      {searchData.map((data, index) => {
        return (
          <CommandItem key={index}>
            <div
              onClick={() => {
                handleOnClickCommandItem(data);
              }}
            >
              {data?.title ?? data}
            </div>
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
