"use client";

import Editor from "@/components/app/EditorJS";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { updateNote } from "@/redux/features/notes.features";
import { AppDispatch, RootState } from "@/redux/store";
import { NoteType } from "@/types/Note.type";
import { Ellipsis, Save } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function NotePage() {
  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { notes } = useSelector((state: RootState) => state.notes);
  const { uid } = useSelector((state: RootState) => state.user);
  const [editorNote, setEditorNote] = useState<NoteType | null>(null);
  const [, setLoading] = useState(false);
  const editorRef = useRef<{ save: () => Promise<string> } | null>(null);

  useEffect(() => {
    notes.forEach((note: NoteType) => {
      if (pathName.includes(note.note_id)) {
        setEditorNote(note);
      }
    });
  }, [notes, pathName]);

  const saveNote = async () => {
    if (!editorNote || !editorRef.current) return;

    try {
      setLoading(true);
      toast.info("Saving note...");
      const content = await editorRef.current.save();

      const updatedNote: NoteType = {
        ...editorNote,
        body: JSON.stringify(content),
        updated_at: Date.now(),
      };

      const dispatchResponse = await dispatch(
        updateNote({ note: updatedNote, uid })
      );

      if (dispatchResponse.meta.requestStatus == "fulfilled") {
        toast.success("Note saved successfully!");
      } else {
        toast.error(dispatchResponse.payload as string);
      }
    } catch (error) {
      console.error("Failed to save editor content:", error);
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="m-2 h-full pt-2">
      <div className="absolute right-4">
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
      <Editor data={editorNote?.body ?? "{}"} editorInstance={editorRef} />
    </div>
  );
}
