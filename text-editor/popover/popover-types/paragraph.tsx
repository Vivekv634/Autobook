"use client";

import TextAlignmentDropdown from "./alignment";

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
