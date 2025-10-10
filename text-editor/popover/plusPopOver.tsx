"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ReactNode } from "react";
import { BlockType } from "../types/type";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { addBlock } from "@/redux/slices/editor.slice";
import {
  Code,
  Heading,
  List,
  ListOrdered,
  ListTodo,
  SeparatorHorizontal,
  Type,
} from "lucide-react";

const allblocks: { icon: ReactNode; value: BlockType; label: string }[] = [
  {
    value: "heading",
    label: "Heading",
    icon: <Heading />,
  },
  {
    value: "paragraph",
    label: "Paragraph",
    icon: <Type />,
  },
  {
    value: "code",
    label: "Code",
    icon: <Code />,
  },
  {
    value: "separator",
    label: "Separator",
    icon: <SeparatorHorizontal />,
  },
  {
    value: "ordered-list",
    label: "Ordered List",
    icon: <ListOrdered />,
  },
  {
    value: "unordered-list",
    label: "Unordered List",
    icon: <List />,
  },
  {
    value: "check-list",
    label: "Check List",
    icon: <ListTodo />,
  },
];

export default function PlusPopoverCombobox({
  children,
  id,
  open,
  setOpen,
}: {
  children: ReactNode;
  id: string;
  open: string;
  setOpen: (value: string) => void;
}) {
  const isOpen = open === id;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Popover
      open={isOpen}
      onOpenChange={(openState) => {
        setOpen(openState ? id : "");
      }}
    >
      <PopoverTrigger asChild className="p-1">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search..."
            autoFocus={false}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No block found.</CommandEmpty>
            <CommandGroup>
              {allblocks.map((b) => (
                <CommandItem
                  key={b.value}
                  value={b.value}
                  onSelect={(currentValue) => {
                    dispatch(addBlock({ id, type: currentValue as BlockType }));
                    setOpen("");
                  }}
                  className="cursor-pointer"
                >
                  {b.icon} {b.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
