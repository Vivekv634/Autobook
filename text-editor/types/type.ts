import z from "zod";

export const blockTypeSchema = z.enum([
  "paragraph",
  "heading",
  "code",
  "ordered-list",
  "unordered-list",
  "check-list",
  "separator",
]);
export const alignmentTypeSchema = z.enum(["center", "left", "justify"]);
export const fontTypeSchema = z.enum(["sans", "mono", "serif"]);
export const separatorTypeSchema = z.enum(["line", "asterisk", "dots"]);
export const listItemSchema = z.object({
  id: z.string(),
  checked: z.boolean().default(false),
  itemContent: z.string(),
});

export const metaTypeSchema = z.object({
  heading: z.number().optional(),
  alignment: alignmentTypeSchema.optional(),
  font: fontTypeSchema.optional(),
  placeholder: z.string().optional(),
  seperatorType: separatorTypeSchema.optional(),
});

export const blockSchema = z.object({
  id: z.string(),
  content: z.union([z.string(), z.array(listItemSchema)]),
  type: blockTypeSchema,
  meta: metaTypeSchema,
  // listItems: z.array(listItemSchema).optional(),
});

export type Block = z.infer<typeof blockSchema>;

export type BlockType = z.infer<typeof blockTypeSchema>;
export type AlignmentType = z.infer<typeof alignmentTypeSchema>;
export type FontType = z.infer<typeof fontTypeSchema>;
export type SeparatorType = z.infer<typeof separatorTypeSchema>;
export type ListItemType = z.infer<typeof listItemSchema>;

export type MetaType = z.infer<typeof metaTypeSchema>;
