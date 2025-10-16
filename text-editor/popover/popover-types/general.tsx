"use client";

import { useEffect, useRef } from "react";
import { Block, MetaType } from "@/text-editor/types/type";
import { ChevronDown, ChevronRight, ChevronUp, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  moveBlock,
  removeBlock,
  setEditorBlocks,
} from "@/redux/slices/editor.slice";

export default function GeneralPopover({
  id,
  hidden,
  open,
  setOpen,
}: {
  id: string;
  hidden: boolean;
  open: string;
  setOpen: (value: string) => void;
}) {
  const { blocks } = useSelector((state: RootState) => state.editor);
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = open === id;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  function handleMetaChange(id: string, meta: MetaType) {
    const newBlocks: Block[] = [];
    blocks.forEach((b) =>
      b.id === id
        ? newBlocks.push({ ...b, meta: { ...b.meta, ...meta } })
        : newBlocks.push(b)
    );

    dispatch(setEditorBlocks(newBlocks));
    setOpen("");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          hidden={hidden}
          className="flex text-sm justify-between items-center w-full p-2 cursor-pointer hover:bg-muted outline-none rounded-sm"
        >
          Font <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          hidden={hidden}
          side="right"
          align="start"
          className="ml-1 w-44"
        >
          <DropdownMenuItem
            onClick={() => handleMetaChange(id, { font: "sans" })}
            className="cursor-pointer"
          >
            Sans
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleMetaChange(id, { font: "serif" })}
            className="cursor-pointer"
          >
            Serif
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleMetaChange(id, { font: "mono" })}
            className="cursor-pointer"
          >
            Mono
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenuSeparator hidden={hidden} />
      <DropdownMenuItem
        className="cursor-pointer"
        disabled={id == blocks[0].id}
        onSelect={() => {
          dispatch(moveBlock({ id, direction: "ArrowUp" }));
        }}
      >
        <ChevronUp />
        Move up
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={blocks.length == 1 && blocks[0].type != "separator"}
        onSelect={() => {
          dispatch(removeBlock({ id }));
        }}
        className="cursor-pointer"
      >
        <Trash2 className="text-red-500" />
        <span className="text-red-500">Delete</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer"
        disabled={id == blocks[blocks.length - 1].id}
        onSelect={() => {
          dispatch(moveBlock({ id, direction: "ArrowDown" }));
        }}
      >
        <ChevronDown />
        Move Down
      </DropdownMenuItem>
    </>
  );
}
