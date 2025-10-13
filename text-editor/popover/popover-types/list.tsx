"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeListType } from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { BlockType } from "@/text-editor/types/type";
import { ChevronRight, List, ListOrdered, ListTodo } from "lucide-react";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";

const listTypes: { icon: ReactNode; label: string; value: BlockType }[] = [
  {
    icon: <List className="h-4 w-4 mr-2" />,
    label: "Ordered List",
    value: "ordered-list",
  },
  {
    icon: <ListOrdered className="h-4 w-4 mr-2" />,
    label: "Unordered List",
    value: "unordered-list",
  },
  {
    icon: <ListTodo className="h-4 w-4 mr-2" />,
    label: "Check List",
    value: "check-list",
  },
];

interface ListPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function ListPopover({ id, setOpen }: ListPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
          List Type <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="ml-1">
          {listTypes.map((lt, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(changeListType({ id, type: lt.value }));
                  setOpen("");
                }}
              >
                {lt.icon} {lt.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
