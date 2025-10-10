"use client";

import { Plus, GripVertical } from "lucide-react";
import GripPopoverCombobox from "./gripPopOver";
import PlusPopoverCombobox from "./plusPopOver";
import { ReactNode } from "react";
import { BlockType } from "../types/type";

interface PopoverWrapperProps {
  children: ReactNode;
  id: string;
  type: BlockType;
  openBlockMenu: string;
  setOpenBlockMenu: (value: string) => void;
  openGripMenu: string;
  setOpenGripMenu: (value: string) => void;
}

export default function PopoverWrapper({
  children,
  type,
  id,
  openBlockMenu,
  openGripMenu,
  setOpenBlockMenu,
  setOpenGripMenu,
}: PopoverWrapperProps) {
  return (
    <div className="flex px-1 gap-1 items-center justify-end group" key={id}>
      <PlusPopoverCombobox
        open={openBlockMenu}
        setOpen={setOpenBlockMenu}
        id={id}
      >
        <Plus className="rounded-sm cursor-pointer duration-100 text-normal transition-all invisible group-hover:visible group-focus-within:visible" />
      </PlusPopoverCombobox>
      <GripPopoverCombobox
        type={type}
        open={openGripMenu}
        setOpen={setOpenGripMenu}
        id={id}
      >
        <GripVertical className="rounded-sm cursor-pointer duration-100 text-normal transition-all invisible group-hover:visible group-focus-within:visible" />
      </GripPopoverCombobox>
      {children}
    </div>
  );
}
