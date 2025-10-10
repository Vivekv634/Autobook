"use client";

import { Button } from "@/components/ui/button";
import { previewTheme, THEMES } from "@/lib/apply-theme";
import Editor from "@/text-editor/Editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { ThemeTypes } from "@/types/Theme.types";
import { ID_LENGTH } from "@/text-editor/lib/block-functions";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setEditorBlocks } from "@/redux/slices/editor.slice";

export default function EditorTesting() {
  const { theme, setTheme } = useTheme();
  const { blocks } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <>
      <section className="space-y-2">
        <Button onClick={() => console.log(blocks)}>print</Button>
        <Button onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>
          theme
        </Button>
        <Select
          onValueChange={(v) => previewTheme(v as ThemeTypes)}
          value={"default"}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(THEMES).map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      <section className="space-y-2 container mx-auto w-full border border-muted-foreground/10 rounded-lg p-4">
        <Editor isContentEditable={true} />
      </section>
      {JSON.stringify(blocks)}
    </>
  );
}
