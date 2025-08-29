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
