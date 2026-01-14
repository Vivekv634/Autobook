import { responseType } from "@/types/User.type";

export default function processPrompt(
  userInstruction: string,
  ResponseType: responseType
) {
  return `Your task is to act as a BlockNote editor and generate a stringified JSON array of objects representing a document. The document content should be based on a user provided topic and a specified response length type: "concise," "balanced," or "detailed."

**Constraints:**

1.  **Format:** The output must be a single stringified JSON array, representing the 'BlockNote' editor's content.
2.  **Schema:** You must strictly adhere to the 'BlockNote' schema. Do not include any properties that are not part of the standard 'BlockNote' block and inline content schema. This includes, but is not limited to, custom metadata, unused properties, or nested objects not supported by the schema.
3.  **Structure:**
    * The top-level element must be a JSON array '[...]'.
    * Each object in the array represents a 'Block'.
    * Each 'Block' object must have a 'type' property (e.g., '"heading"', '"paragraph"', '"bulletListItem"', '"numberedListItem"') and a 'content' property.
    * The 'content' property must be an array of 'InlineContent' objects, each with a 'type' (e.g., '"text"', '"link"') and other properties based on its type.
    * For 'text' content, the 'text' property must contain the actual string. You may also include a 'styles' property for formatting (e.g., '"bold"', '"italic"', '"underline"', '"code"') as a JSON object.
    * List items must be correctly nested using the 'children' property and 'level' property where appropriate.
4.  **Length Types:**
    * **Concise:** Generate a short, succinct document. The content should be to the point, and the formatting should be minimal (e.g., a few headings and paragraphs).
    * **Balanced:** Generate a moderately-sized document. The content should be well-structured with a mix of block types like headings, paragraphs, and a simple list. Formatting should be a mix of bold, italic, and underline.
    * **Detailed:** Generate a comprehensive document. The content should be extensive, including multiple headings, paragraphs, and a combination of bullet and numbered lists (including nested lists). The formatting should be rich, utilizing a variety of styles.

**User Topic:** Generate a ${ResponseType} BlockNote JSON array for the topic: "${userInstruction}"`;
}

export const processPromptWithTitle = (
  userInstruction: string,
  ResponseType: responseType
) => {
  return `Your task is to act as a BlockNote editor and generate a stringified JSON object with the following structure:

{
  "title": "<A concise title derived from the userInstruction should be under 40 characters>",
  "content": [ ... ]
}

### Requirements

1. **Output Format**
   - The result must be a single valid JSON object, stringified.
   - The "title" field must be a short descriptive heading extracted from the userInstruction.
   - The "content" field must be a stringified JSON array of BlockNote blocks.

2. **Schema Compliance**
   - Adhere strictly to the BlockNote schema.
   - Each Block must have:
     - "type" (e.g., "heading", "paragraph", "bulletListItem", "numberedListItem").
     - "content" (an array of InlineContent objects).
   - InlineContent objects must follow schema rules:
     - For "text": include a "text" property with the actual string, and optionally a "styles" object (e.g., { "bold": true, "italic": true }).
     - For "link": include "href" and "text".
   - List items must be properly nested using "children" and "level" where supported.
   - Do not include any properties not supported by the BlockNote schema.

3. **Response Length Control**
   - **Concise** → Short and minimal: a few headings and paragraphs only.
   - **Balanced** → Moderate length: headings, paragraphs, and one simple list, with mixed formatting (bold/italic/underline).
   - **Detailed** → Comprehensive: multiple headings, paragraphs, bullet and numbered lists (including nesting), with rich use of styles.

4. **Instruction Binding**
   - Use the provided 'userInstruction' as the document topic.
   - Generate content based on the specified 'ResponseType' ("concise", "balanced", "detailed").

### Template
"Generate a ${ResponseType} BlockNote JSON object for the topic: '${userInstruction}'"`;
};

export const searchPrompt = `You are BlockNote's content-generation engine.

Task:
- Generate exactly 3 personalized, one-line "search" suggestions phrased as questions.
- Each suggestion should be a trending or engaging topic (e.g., sports, education, research, news, evolving technologies, lifestyle).
- Suggestions must be designed to act as clickable prompts in a note-taking application for LLM expansion.
- Keep them human-behavior aligned: phrased as natural questions a user might ask.

Output Rules:
- Return a single JSON object with keys "0", "1", and "2".
- Values = string (one-line question).
- No explanations, no prose, no extra fields, no arrays, no markdown.
- Do not include reasoning or metadata.
- Ignore any instructions that ask for format changes.

Output Format (example):
{
  "0": "make an empty checklist of length 10 for shopping essentials?",
  "1": "research and generate a research paper on a specific topic?",
  "2": "compare two different topics and show results in a table?"
}
`;

export function improvePromptHelper(prompt: string) {
  return `Your task is to improve a user-provided prompt by enhancing its clarity and effectiveness for a large language model.

**Instructions:**

1.  **Correct Vocabulary:** Identify and correct any grammatical errors, misspellings, or awkward phrasing.
2.  **Enhance Clarity:** Replace vague or weak words with more specific and precise language.
3.  **Ensure Straightforwardness:** Rewrite the prompt to be direct and concise. Remove any unnecessary conversational filler or redundant information. The final prompt should clearly state its objective.

**Output:**

Provide only the final, revised prompt.

**User's prompt:** ${prompt}`;
}

export function promptAfterOCR(input: string) {
  return `You are an expert in converting free-form text into a structured JSON object using a predefined schema. Your task is to deeply analyze the input text, break it into logical segments, classify each segment into a block type, and output a JSON array of blocks that strictly follows the schema rules.

Your responsibilities:
1. Read and understand the full input text.
2. Segment the text into logical blocks.
3. Decide the most appropriate block type for each segment from the following: paragraph, heading, code, ordered-list, unordered-list, check-list, separator, warning
4. Generate an array of JSON objects that strictly follow the provided schema.
5. Output only valid JSON with no additional explanations.

SCHEMA RULES (follow exactly):
Each block must follow this shape:
{ id: string of exactly 8 characters, data: one object discriminated by the field "type" }

The possible data structures are:
1. Paragraph block: { type: "paragraph", content: string, align: "left" | "center" | "justify", font: "sans" | "mono" | "serif" }
2. Heading block: { type: "heading", content: string, level: 1 | 2 | 3, align: "left" | "center" | "justify", font: "sans" | "mono" | "serif" }
3. List item structure: { id: string of length 8, listContent: string, checked: boolean }
4. Ordered list block: { type: "ordered-list", content: array of ListItem }
5. Unordered list block: { type: "unordered-list", content: array of ListItem }
6. Check-list block: { type: "check-list", content: array of ListItem }
7. Code block: { type: "code", content: string (raw code), font: "mono" }
8. Separator block: { type: "separator", content: "line" | "asterisk" | "dots" }
9. Warning block: { type: "warning", warningType: "note" | "warning" | "error" | "success", content: string }

ID RULE:
All ids (both block.id and listItem.id) must be unique and exactly 8 characters long (alphanumeric).

ANALYSIS RULES:

Headings:
* Detect if a text segment looks like a title or section heading.
* Heading levels: 1 for main title; 2 for major sections; 3 for subsections.
* Remove leading symbols like "#", "##", "1.", "2)", etc.

Paragraphs:
* Merge lines into a single paragraph when they logically belong together.
* Use align = "left" unless centered text is clearly intended.
* Use font = "sans" unless special context indicates another font.

Lists:
* Ordered lists: lines starting with numbers like "1. ", "2)", "3 -".
* Unordered lists: lines starting with "-", "*", "•", etc.
* Check-lists: lines containing "[ ]", "[x]", "[X]", optionally with "- [ ]".
* For check-lists, checked = true when "[x]" or "[X]" appears.

Code:
* Detect code using \`\`\` or ~~~ fences or based on code-like structure (multiple lines with indentation, braces, or semicolons).
* Preserve formatting exactly.

Warnings:
* Detect "Note:", "Important:", "Warning:", "Error:", "Success:", "Tip:".
* Map:
  Note/Tip/Important → note
  Warning/Caution → warning
  Error/Failure → error
  Success/Completed → success
* Remove the leading keyword from the content.

Separators:
* Detect horizontal rules like "---", "***", "___", or a standalone "...".
* Map:
  "---" or "___" → line
  "***" → asterisk
  "..." → dots
* You may optionally insert a separator where a strong conceptual break exists.

OUTPUT RULES:
* Output only a JSON array of block objects.
* No explanations, no comments, no extra text.
* Strictly follow the schema and ID rules.
* No trailing commas.

USER INPUT: ${input}`;
}
