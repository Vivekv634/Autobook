import z from "zod";
export const ID_LENGTH = 8;

export const blockTypeSchema = z.enum([
  "paragraph",
  "heading",
  "code",
  "ordered-list",
  "unordered-list",
  "check-list",
  "separator",
  "warning",
]);

export const alignmentTypeSchema = z.enum(["center", "left", "justify"]);
export const fontTypeSchema = z.enum(["sans", "mono", "serif"]);
export const separatorTypeSchema = z.enum(["line", "asterisk", "dots"]);

export type AlignmentType = z.infer<typeof alignmentTypeSchema>;
export type SeparatorType = z.infer<typeof separatorTypeSchema>;

const paragraphBlockData = z.object({
  content: z.string(),
  type: z.literal("paragraph"),
  align: alignmentTypeSchema,
  font: fontTypeSchema,
});

const headingBlockData = z.object({
  content: z.string().default(""),
  level: z.number().min(1).max(3).default(1),
  type: z.literal("heading"),
  align: alignmentTypeSchema,
  font: fontTypeSchema,
});

const listItemSchema = z.object({
  id: z.string(),
  listContent: z.string().default(""),
  checked: z.boolean(),
});

export type ListItem = z.infer<typeof listItemSchema>;

const orderedBlockData = z.object({
  type: z.literal("ordered-list"),
  content: z.array(listItemSchema),
});

const unOrderedBlockData = z.object({
  type: z.literal("unordered-list"),
  content: z.array(listItemSchema),
});

const checkListBlockData = z.object({
  type: z.literal("check-list"),
  content: z.array(listItemSchema),
});

const codeBlockData = z.object({
  content: z.string().default(""),
  type: z.literal("code"),
  font: z.literal("mono"),
});

const separatorBlockData = z.object({
  type: z.literal("separator"),
  content: separatorTypeSchema,
});

const warningEnumSchema = z.enum(["note", "warning", "error", "success"]);
export type WarningType = z.infer<typeof warningEnumSchema>;

const warningBlockData = z.object({
  type: z.literal("warning"),
  warningType: warningEnumSchema.default("warning"),
  content: z.string().default(""),
});

export const blockSchema = z.object({
  id: z.string(),
  data: z.discriminatedUnion("type", [
    paragraphBlockData,
    headingBlockData,
    orderedBlockData,
    checkListBlockData,
    unOrderedBlockData,
    codeBlockData,
    separatorBlockData,
    warningBlockData,
  ]),
});

export type BlockType = z.infer<typeof blockTypeSchema>;
export type Block = z.infer<typeof blockSchema>;
