"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  setBlockInput,
  setFocusBlockID,
  updateMetaData,
} from "@/redux/slices/editor.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { Block, BlockType } from "@/text-editor/types/type";
import { ChevronRight, Heading1, Heading2, Heading3 } from "lucide-react";
import TextAlignmentDropdown from "./alignment";
import { cn } from "@/lib/utils";
import { commonClassNames } from "@/text-editor/Editor";
import { headingClassName } from "@/text-editor/lib/helper-function";
import { JSX, KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const { blocks } = useSelector((state: RootState) => state.editor);
  const b = blocks.find((b) => b.id === id);

  function handleMetaUpdate(level: number) {
    if (!b) return;

    if (["heading"].includes(b.data.type)) {
      const updatedData = { ...b.data, level };
      dispatch(
        updateMetaData({ id: b.id, data: updatedData as typeof b.data })
      );
    }
    setOpen("");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
          Levels <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="ml-1">
          {LEVELS.map((l, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={() => {
                  handleMetaUpdate(i + 1);
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

interface BlockProps {
  handleKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string
  ): void;
  b: Block;
  isContentEditable: boolean;
}

export function HeadingBlock({
  handleKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();
  if (b.data.type !== "heading") return;

  const heading = b.data.level ?? 1;
  const HeadingTag = `h${heading}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag
      onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
      data-placeholder={`Heading ${b.data.level ?? 1}`}
      id={b.id}
      suppressContentEditableWarning={true}
      suppressHydrationWarning={true}
      onKeyDown={(e) => handleKeyDown(e, b.data.type, b.id)}
      key={b.id}
      className={cn(
        commonClassNames,
        headingClassName(heading),
        `font-${b.data.font ?? "sans"}`,
        `text-${b.data.align ?? "left"}`
      )}
      onInput={(e) => {
        const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
        dispatch(setBlockInput({ id: b.id, content: html }));
      }}
      contentEditable={isContentEditable}
    ></HeadingTag>
  );
}
