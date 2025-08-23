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
import { Ellipsis, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { updateNote } from "@/redux/features/notes.features";
import { toast } from "sonner";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { InputActionBlock } from "@/components/editor/ai-block";
import { Separator } from "@/components/ui/separator";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    inputAction: InputActionBlock,
  },
});

export default function NotePage() {
  const pathName = usePathname();
  const { notes } = useSelector((state: RootState) => state.notes);
  const { uid, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [editorNote, setEditorNote] = useState<NoteType | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const foundNote = notes.find((note: NoteType) =>
      pathName.includes(note.note_id)
    );
    setEditorNote(foundNote ?? null);
  }, [notes, pathName]);

  const editor = useCreateBlockNote({ schema });

  useEffect(() => {
    if (editor && editorNote?.body) {
      try {
        const parsed = JSON.parse(editorNote.body);
        if (!editor.document) return;
        editor.replaceBlocks(editor.document, parsed);
      } catch (err) {
        console.error("Failed to parse note body:", err);
      }
    }
  }, [editor, editorNote]);

  type editorType = typeof editor;

  const insertInputActionItem = (editor: editorType) => ({
    title: "Ask AI",
    onItemClick: () =>
      insertOrUpdateBlock(editor, {
        type: "inputAction",
        props: { value: undefined },
      }),
    aliases: ["ai", "generate"],
    group: "AI",
    subtext: "write with AI",
    icon: <Sparkles className="h-4" />,
  });

  const saveNote = async () => {
    if (!editor || !editorNote || !editor.document) return;
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

  if (!editor || !user) return null;

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

  const getSlashMenuItems = async (query: string) =>
    filterSuggestionItems(
      [...getDefaultReactSlashMenuItems(editor), insertInputActionItem(editor)],
      query
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

      <BlockNoteView
        editor={editor}
        theme={theme == "dark" ? "dark" : "light"}
        slashMenu={false}
        className={cn(
          theme == "light" && "border border-gray-200 rounded-sm",
          "mx-2"
        )}
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={getSlashMenuItems}
        />
      </BlockNoteView>
    </div>
  );
}
