"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { EDITORJS_TOOLS } from "@/lib/editorConfig";
import { cn } from "@/lib/utils";
import EditorJS from "@editorjs/editorjs";
import DragDrop from "editorjs-drag-drop";
import Undo from "editorjs-undo";
import { useEffect } from "react";

export default function Editor({ data, readOnly = false, editorInstance }) {
  const isMobile = useIsMobile();
  // const { user } = useSelector((state) => state.note);

  useEffect(() => {
    if (!editorInstance.current && data) {
      const editor = new EditorJS({
        tools: {
          ...EDITORJS_TOOLS,
        },
        holder: "editorjs",
        readOnly,
        data: JSON.parse(data ?? "{}"),
        onReady: () => {
          new Undo({ editor });
          new DragDrop(editor, "2px dash #000");
          console.log("Editor is ready to work!");
        },
        autofocus: true,
        placeholder: "Type '/' for options...",
      });

      editorInstance.current = editor;
    }

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div
      id="editorjs"
      className={cn(
        isMobile
          ? "mx-1 px-1"
          : "container mx-auto px-20 border rounded-2xl border-muted dark:border-muted/50",
      )}
    />
  );
}
