'use client';
import React from 'react';

import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export default function NoteBookSearchDialog({
  searchData,
  noFoundPrompt,
  setOpen,
}) {
  const router = useRouter();
  const handleOnClickCommandItem = (notebook_id) => {
    router.push(`/dashboard/notebooks#${notebook_id}`);
    setOpen(false);
  };
  return (
    <CommandList>
      <CommandEmpty>{noFoundPrompt}</CommandEmpty>
      {Object.keys(searchData).map((notebook_id, index) => {
        return (
          <CommandItem key={index} className="cursor-pointer">
            <div
              onClick={() => {
                handleOnClickCommandItem(notebook_id);
              }}
            >
              {searchData[notebook_id]}
            </div>
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
