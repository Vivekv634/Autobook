"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import { Ellipsis, Save } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { updateNote } from "@/redux/features/notes.features";
import { toast } from "sonner";

export default function NotePage() {
  const pathName = usePathname();
  const { notes } = useSelector((state: RootState) => state.notes);
  const { uid } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [editorNote, setEditorNote] = useState<NoteType | null>(null);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);
  const { theme } = useTheme();

  const isInitializedRef = useRef(false); // prevents double initialization

  useEffect(() => {
    notes.forEach((note: NoteType) => {
      if (pathName.includes(note.note_id)) {
        setEditorNote(note);

        if (!isInitializedRef.current) {
          const blocks: PartialBlock[] = JSON.parse(note.body);
          const newEditor = BlockNoteEditor.create({
            initialContent: blocks,
          });
          setEditor(newEditor);
          isInitializedRef.current = true;
        }
      }
    });
  }, [notes, pathName]);

  const saveNote = async () => {
    if (!editor || !editorNote) return;
    const note: NoteType = {
      ...editorNote,
      body: JSON.stringify(editor.document),
      updated_at: Date.now(),
    };

    const dispatchResponse = await dispatch(updateNote({ note, uid }));
    if (dispatchResponse.meta.requestStatus === "fulfilled") {
      toast.success("Note updated successfully!");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  };

  if (!editor) {
    return null;
  }

  if (!editorNote)
    return (
      <section className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">
            Oops! can&apos;t find this page.
          </h2>
          <Link
            href={"/dashboard"}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    );

  return (
    <div className="m-2 h-full pt-2 container mx-auto">
      <div className="mx-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuPortal
            container={document.querySelector("dropdown-portal")}
          >
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={saveNote}>
                <Save /> Save
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
      <BlockNoteView
        editor={editor}
        theme={theme == "dark" ? "dark" : "light"}
        className={cn(
          theme == "light" && "border border-gray-200 rounded-sm",
          "mx-2"
        )}
      />
    </div>
  );
}
