import { nanoid } from "@reduxjs/toolkit";
import { BlockType, ID_LENGTH } from "../types/type";
import { Block } from "../types/type";

export function headingClassName(heading: number) {
  switch (heading) {
    case 1:
      return "text-4xl font-bold";
    case 2:
      return "text-3xl font-bold";
    case 3:
      return "text-2xl font-bold";
    default:
      return "";
  }
}

export function detectLanguage(code: string): string {
  if (!code.trim()) return "text";
  if (/function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|console\.log/.test(code))
    return "javascript";
  if (/def\s+\w+|import\s+\w+|print\(/.test(code)) return "python";
  if (/public\s+class|System\.out/.test(code)) return "java";
  if (/{\s*[^}]*}/.test(code) && /color|font|margin/.test(code)) return "css";
  if (/<[^>]*>/.test(code)) return "html";
  if (/SELECT|FROM|WHERE/i.test(code)) return "sql";
  return "text";
}

export function dataMapper(type: BlockType): Block["data"] {
  switch (type) {
    case "paragraph":
      return {
        type: "paragraph",
        content: "",
        align: "left",
        font: "sans",
      };

    case "code":
      return {
        type: "code",
        content: "",
        font: "mono",
      };
    case "heading":
      return {
        type: "heading",
        level: 1,
        content: "",
        align: "left",
        font: "sans",
      };

    case "unordered-list":
      return {
        type: "unordered-list",
        content: [{ id: nanoid(ID_LENGTH), checked: false, listContent: "" }],
      };

    case "check-list":
      return {
        type: "check-list",
        content: [{ id: nanoid(ID_LENGTH), checked: false, listContent: "" }],
      };

    case "ordered-list":
      return {
        type: "ordered-list",
        content: [{ id: nanoid(ID_LENGTH), checked: false, listContent: "" }],
      };

    case "warning":
      return {
        type: "warning",
        content: "",
        warningType: "note",
      };

    default:
      return {
        type: "paragraph",
        content: "",
        align: "left",
        font: "sans",
      };
  }
}

export function listTypeMapper(
  b: Block,
  targetListType: BlockType
): Block["data"] | null {
  if (typeof b.data.content === "string") return null;
  switch (targetListType) {
    case "unordered-list":
      return {
        type: "unordered-list",
        content: [...b.data.content],
      };
    case "ordered-list":
      return {
        type: "ordered-list",
        content: [...b.data.content],
      };
    default:
      return {
        type: "check-list",
        content: [...b.data.content],
      };
  }
}
