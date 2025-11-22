"use client";

import { useEffect, useRef } from "react";
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
  updateMetaData,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = open === id;

  const dispatch = useDispatch<AppDispatch>();
  const { blocks } = useSelector((state: RootState) => state.editor);
  const b = blocks.find((b) => b.id === id);

  function handleMetaUpdate(font: "sans" | "serif" | "mono") {
    if (!b) return;

    if (["heading", "pargraph"].includes(b.data.type)) {
      const updatedData = { ...b.data, font };
      dispatch(
        updateMetaData({ id: b.id, data: updatedData as typeof b.data })
      );
    }
    setOpen("");
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          hidden={hidden}
          className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm"
        >
          Font <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          hidden={hidden}
          side="right"
          align="start"
          className="ml-1"
        >
          <DropdownMenuItem
            onClick={() => handleMetaUpdate("sans")}
            className="cursor-pointer"
          >
            Sans
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleMetaUpdate("serif")}
            className="cursor-pointer"
          >
            Serif
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleMetaUpdate("mono")}
            className="cursor-pointer"
          >
            Mono
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenuSeparator hidden={hidden} />
      <DropdownMenuItem
        disabled={id == blocks[0].id}
        onSelect={() => {
          dispatch(moveBlock({ id, direction: "ArrowUp" }));
        }}
      >
        <ChevronUp />
        Move up
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={blocks.length == 1 && blocks[0].data.type != "separator"}
        onSelect={() => {
          dispatch(removeBlock({ id }));
        }}
        className="text-red-500 active:text-red-500 active:bg-red-200"
      >
        <Trash2 className="text-red-500" />
        Delete
      </DropdownMenuItem>
      <DropdownMenuItem
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
