"use client";

import TextAlignmentDropdown from "./alignment";
import { cn } from "@/lib/utils";
import { setFocusBlockID, setBlockInput } from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { KeyboardEvent } from "react";
import { commonClassNames } from "@/text-editor/Editor";
import { BlockType } from "@/text-editor/types/type";
import { Block } from "@/text-editor/types/type";

interface ParagraphPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function ParagraphPopover({
  id,
  setOpen,
}: ParagraphPopoverProps) {
  return (
    <>
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

export function ParagraphBlock({
  handleKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();

  if (b.data.type != "paragraph") return;

  return (
    <p
      onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
      id={b.id}
      suppressContentEditableWarning={true}
      data-placeholder={"Hit '/' for commands..."}
      onInput={(e) => {
        const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
        dispatch(setBlockInput({ id: b.id, content: html }));
      }}
      onKeyDown={(e) => handleKeyDown(e, b.data.type, b.id)}
      className={cn(
        commonClassNames,
        `font-${b.data.font ?? "sans"}`,
        `text-${b.data.align ?? "left"}`
      )}
      contentEditable={isContentEditable}
    ></p>
  );
}
