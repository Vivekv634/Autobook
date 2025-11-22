"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateMetaData } from "@/redux/slices/editor.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { SeparatorType } from "@/text-editor/types/type";
import { Asterisk, ChevronRight, Dot, Minus } from "lucide-react";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

const types: {
  icon: ReactNode;
  label: string;
  value: SeparatorType;
}[] = [
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
  const { blocks } = useSelector((state: RootState) => state.editor);
  const b = blocks.find((b) => b.id === id);

  function handleMetaChange(id: string, type: SeparatorType) {
    if (!b) return;

    const updatedData = { ...b.data, content: type };
    dispatch(updateMetaData({ id: b.id, data: updatedData as typeof b.data }));
    setOpen("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
        Type <ChevronRight className="h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="ml-1">
        {types.map((s, i) => {
          return (
            <DropdownMenuItem
              key={i}
              className="cursor-pointer"
              onClick={() => {
                handleMetaChange(id, s.value);
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
