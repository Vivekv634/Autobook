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
import { Block, blockSchema, ID_LENGTH } from "@/text-editor/types/type";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setEditorBlocks } from "@/redux/slices/editor.slice";
import { Input } from "@/components/ui/input";
import { createWorker } from "tesseract.js";
import { promptAfterOCR } from "@/lib/process-prompt";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import pdfToText from "react-pdftotext";
import { jsonTextSlicer } from "@/lib/utils";

export default function EditorTesting() {
  const { theme, setTheme } = useTheme();
  const { blocks } = useSelector((state: RootState) => state.editor);
  const dispatch = useDispatch<AppDispatch>();
  const [File, setFile] = useState<FileList | null>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (blocks.length == 0) {
      dispatch(
        setEditorBlocks([
          {
            id: nanoid(ID_LENGTH),
            data: {
              content: "",
              type: "paragraph",
              align: "left",
              font: "sans",
            },
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

  async function handleNonPdfDocuments(file: File) {
    const worker = createWorker("eng");

    const apiKey =
      user?.gemini_api_key || process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;

    if (!apiKey) {
      toast.error("Getting error while generating content!");
      console.error("API key not given.");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    (await worker).recognize(file).then(async (response) => {
      if (!response.data.text) return;

      const contents = promptAfterOCR(response.data.text);

      if (!contents) return;

      const apiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
      });

      if (!apiResponse.text) return;
      const processedResponse = JSON.parse(jsonTextSlicer(apiResponse.text));
      dispatch(setEditorBlocks(processedResponse));
    });
  }

  async function handlePdfDocuments(file: File) {
    const apiKey =
      user?.gemini_api_key || process.env.NEXT_PUBLIC_FALLBACK_LLM_API_KEY;

    if (!apiKey) {
      toast.error("Getting error while generating content!");
      console.error("API key not given.");
      return;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    pdfToText(file).then(async (pdfText) => {
      if (!pdfText) return;

      const contents = promptAfterOCR(pdfText);
      if (!contents) return;
      console.log(contents);

      const apiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
      });

      if (!apiResponse.text) return;
      console.log(apiResponse.text);

      const processedResponse = JSON.parse(
        jsonTextSlicer(apiResponse.text)
      ) as Block[];

      const parsedResponse: Block[] = [];
      processedResponse.forEach(
        (b) => blockSchema.safeParse(b).success && parsedResponse.push(b)
      );
      console.log(parsedResponse);
      dispatch(setEditorBlocks(parsedResponse));
    });
  }

  async function handleOCR() {
    if (!File) return;
    if (File[0].name.endsWith(".pdf")) {
      handlePdfDocuments(File[0]);
    } else {
      handleNonPdfDocuments(File[0]);
    }
  }

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

      <section>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files)}
            accept=".png, .pdf, .jpeg, .jpg"
          />
          <Button onClick={handleOCR}>OCR it.</Button>
        </form>
      </section>
    </>
  );
}
