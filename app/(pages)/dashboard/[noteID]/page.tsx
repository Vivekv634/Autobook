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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { updateNote } from "@/redux/features/notes.features";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import Editor from "@/text-editor/Editor";
import { setEditorBlocks } from "@/redux/slices/editor.slice";
import { ID_LENGTH } from "@/text-editor/types/type";
import { nanoid } from "@reduxjs/toolkit";

export default function NotePage() {
  const pathName = usePathname();
  const { notes } = useSelector((state: RootState) => state.notes);
  const { uid, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [editorNote, setEditorNote] = useState<NoteType | null>(null);
  const { blocks } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    const foundNote = notes.find((note: NoteType) =>
      pathName.includes(note.note_id)
    );
    if (foundNote) {
      setEditorNote(foundNote);
      const body = JSON.parse(foundNote.body);
      dispatch(setEditorBlocks([...body]));
    }
  }, [notes, pathName, dispatch]);

  useEffect(() => {
    if (blocks.length == 0) {
      dispatch(
        setEditorBlocks([
          {
            id: nanoid(ID_LENGTH),
            content: "",
            meta: {},
            type: "paragraph",
          },
        ])
      );
    }
    setTimeout(() => {
      if (blocks.length == 1) {
        const element = document.getElementById(`${blocks[0].id}`);
        if (element) element.focus();
      }
    }, 50);
  }, [blocks, dispatch]);

  const saveNote = async () => {
    if (!editorNote) return;
    const note: NoteType = {
      ...editorNote,
      body: JSON.stringify(blocks),
      updated_at: Date.now(),
    };

    const dispatchResponse = await dispatch(updateNote({ note, uid }));
    if (dispatchResponse.meta.requestStatus === "fulfilled") {
      toast.success("Note updated successfully!");
    } else {
      toast.error("Something went wrong. Try again!");
    }
  };

  if (!user) return null;

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
    <div className="m-2 h-full pt-2 container mb-20 mx-auto">
      <div className="mx-2 flex h-9 items-center mb-4">
        <h2 className="font-bold text-3xl">{editorNote.title}</h2>
        <Separator orientation="vertical" className="mx-3 bg-secondary/70" />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={saveNote}>
                <Save /> Save
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
      <section className="space-y-2 w-full border border-muted-foreground/10 rounded-lg py-4 px-1">
        <Editor isContentEditable={true} />
      </section>
    </div>
  );
}
