"use client";

import { ReactNode, useEffect, useRef } from "react";
import { BlockType } from "../types/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GeneralPopover from "./popover-types/general";
import HeadingPopover from "./popover-types/heading";
import ParagraphPopover from "./popover-types/paragraph";
import SeparatorPopover from "./popover-types/separator";

export default function GripPopoverCombobox({
  children,
  id,
  open,
  type,
  setOpen,
}: {
  children: ReactNode;
  id: string;
  open: string;
  type: BlockType;
  setOpen: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = open === id;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  function popoverMapper(type: BlockType) {
    switch (type) {
      case "heading":
        return <HeadingPopover id={id} setOpen={setOpen} />;
      case "paragraph":
        return <ParagraphPopover id={id} setOpen={setOpen} />;
      case "separator":
        return <SeparatorPopover id={id} setOpen={setOpen} />;
      default:
        return null;
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="p-1">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" align="start" side="bottom">
        {popoverMapper(type)}
        <GeneralPopover
          hidden={type == "separator"}
          id={id}
          open={open}
          setOpen={setOpen}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
