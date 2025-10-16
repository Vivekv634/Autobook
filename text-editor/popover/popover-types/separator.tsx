"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateMetaData } from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { MetaType, SeparatorType } from "@/text-editor/types/type";
import { Asterisk, ChevronRight, Dot, Minus } from "lucide-react";
import { useDispatch } from "react-redux";

const types = [
  { icon: <Dot />, label: "Dots", value: "dots" },
  { icon: <Asterisk />, label: "Stars", value: "asterisk" },
  { icon: <Minus />, label: "Line", value: "line" },
];

interface SeparatorPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function SeparatorPopover({
  id,
  setOpen,
}: SeparatorPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();

  function handleMetaChange(id: string, meta: MetaType) {
    dispatch(updateMetaData({ id, meta }));
    setOpen("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full p-2 cursor-pointer hover:bg-muted outline-none rounded-sm">
        Type <ChevronRight className="h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="ml-1">
        {types.map((s, i) => {
          return (
            <DropdownMenuItem
              key={i}
              className="cursor-pointer"
              onClick={() => {
                handleMetaChange(id, {
                  seperatorType: s.value as SeparatorType,
                });
              }}
            >
              {s.icon} {s.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
