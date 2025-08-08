"use client";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useMemo } from "react";

export default function NoteEditor({
  initialContent,
}: {
  initialContent: PartialBlock[] | null;
}) {
  const editor = useMemo(() => {
    if (!initialContent) {
      return null;
    }
    return BlockNoteEditor.create({
      initialContent,
    });
  }, [initialContent]);

  if (!editor) {
    return "Loading content...";
  }

  return <BlockNoteView editor={editor} />;
}
