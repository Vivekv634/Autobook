"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateMetaData } from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { MetaType } from "@/text-editor/types/type";
import { ChevronRight, Heading1, Heading2, Heading3 } from "lucide-react";
import { useDispatch } from "react-redux";
import TextAlignmentDropdown from "./alignment";

const LEVELS = [
  <Heading1 key={1} />,
  <Heading2 key={2} />,
  <Heading3 key={3} />,
];

interface HeadingPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function HeadingPopover({ id, setOpen }: HeadingPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();

  function handleMetaChange(id: string, meta: MetaType) {
    dispatch(updateMetaData({ id, meta }));
    setOpen("");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full p-2 cursor-pointer hover:bg-muted outline-none rounded-sm">
          Levels <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="ml-1">
          {LEVELS.map((l, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={() => {
                  handleMetaChange(id, { heading: i + 1 });
                }}
              >
                {l} Heading {i + 1}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <TextAlignmentDropdown exclude={[]} id={id} setOpen={setOpen} />
    </>
  );
}
