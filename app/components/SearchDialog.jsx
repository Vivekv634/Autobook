'use client';
import React from 'react';

import {
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { usePathname, useRouter } from 'next/navigation';

export default function SearchDialog({ searchData, noFoundPrompt, setOpen }) {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <CommandList>
      <CommandEmpty>{noFoundPrompt}</CommandEmpty>
      {searchData.map((data, index) => {
        return (
          <CommandItem key={index}>
            <div
              onClick={() => {
                router.push(`${pathName}#${data?.noteID ?? data}`);
                setOpen(false);
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
