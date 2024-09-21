'use client';
import React from 'react';

import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export default function AutoNoteSearchDialog({
  searchData,
  noFoundPrompt,
  setOpen,
}) {
  const router = useRouter();
  const handleOnClickCommandItem = (autoNote) => {
    router.push(`/dashboard/auto-note#${autoNote.autoNoteID}`);
    setOpen(false);
  };
  return (
    <CommandList>
      <CommandEmpty>{noFoundPrompt}</CommandEmpty>
      {searchData?.map((data, index) => {
        return (
          <CommandItem key={index}>
            <div
              onClick={() => {
                handleOnClickCommandItem(data);
              }}
            >
              {data.autoNoteName ?? data}
            </div>
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
