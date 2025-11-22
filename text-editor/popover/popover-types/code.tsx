import { cn } from "@/lib/utils";
import { setBlockInput, setFocusBlockID } from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { commonClassNames } from "@/text-editor/Editor";
import { BlockType } from "@/text-editor/types/type";
import { Block } from "@/text-editor/types/type";
import { Copy } from "lucide-react";
import { KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface BlockProps {
  handleKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string
  ): void;
  b: Block;
  isContentEditable: boolean;
}

export default function CodeBlock({
  handleKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();

  async function handleCopy(content: string) {
    if (content.length == 0) return;
    await navigator.clipboard.writeText(content);
    toast.info("Copied to clipboard");
  }

  return (
    <>
      <code
        suppressContentEditableWarning={true}
        onInput={(e) => {
          const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
          dispatch(setBlockInput({ id: b.id, content: html }));
        }}
        onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
        data-placeholder="code..."
        id={b.id}
        onKeyDown={(e) => handleKeyDown(e, b.data.type, b.id)}
        className={cn(
          commonClassNames,
          "font-mono px-4 py-2 md:py-4 md:px-9 rounded-md bg-muted whitespace-pre-wrap"
        )}
        contentEditable={isContentEditable}
      ></code>
      <Copy
        className="absolute top-2 right-2 cursor-pointer text-muted-foreground/80 rounded-md h-8 w-8 p-1 group-focus-within:text-accent-foreground group-hover:text-accent-foreground"
        onClick={() =>
          typeof b.data.content === "string" && handleCopy(b.data.content)
        }
      />
    </>
  );
}
