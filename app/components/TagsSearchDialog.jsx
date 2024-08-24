'use client';
import React from 'react';

import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';

export default function TagsSearchDialog({
  searchData,
  noFoundPrompt,
  setOpen,
}) {
  const router = useRouter();
  const handleOnClickCommandItem = (tag) => {
    router.push(`/dashboard/tags#${tag}`);
    setOpen(false);
  };
  return (
    <CommandList>
      <CommandEmpty>{noFoundPrompt}</CommandEmpty>
      {searchData.map((tag, index) => {
        return (
          <CommandItem key={index}>
            <div
              onClick={() => {
                handleOnClickCommandItem(tag);
              }}
            >
              {tag}
            </div>
          </CommandItem>
        );
      })}
    </CommandList>
  );
}
