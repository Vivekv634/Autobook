"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  setBlockInput,
  setFocusBlockID,
  updateMetaData,
} from "@/redux/slices/editor.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { Block, BlockType, WarningType } from "@/text-editor/types/type";
import {
  ChevronRight,
  CircleCheck,
  Info,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { KeyboardEvent, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { commonClassNames } from "@/text-editor/Editor";

const warningTypes: {
  [key: string]: {
    wt: WarningType;
    w: string;
    icon: ReactNode;
    color: { [key: string]: string };
  };
} = {
  note: {
    wt: "note",
    w: "Note",
    icon: <Info className="h-4 w-4 text-blue-400" />,
    color: {
      text: "text-blue-400",
      bg: "bg-blue-50",
      border: "border-blue-400",
    },
  },
  success: {
    wt: "success",
    w: "Success",
    icon: <CircleCheck className="h-4 w-4 text-green-400" />,
    color: {
      text: "text-green-400",
      bg: "bg-green-50",
      border: "border-green-400",
    },
  },
  error: {
    wt: "error",
    w: "Error",
    icon: <OctagonX className="h-4 w-4 text-red-400" />,
    color: {
      text: "text-red-400",
      bg: "bg-red-50",
      border: "border-red-400",
    },
  },
  warning: {
    wt: "warning",
    w: "Warning",
    icon: <TriangleAlert className="h-4 w-4 text-yellow-400" />,
    color: {
      text: "text-yellow-400",
      bg: "bg-yellow-50",
      border: "border-yellow-400",
    },
  },
};

interface WarningPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function WarningPopover({ id, setOpen }: WarningPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { blocks } = useSelector((state: RootState) => state.editor);
  const b = blocks.find((b) => b.id === id);

  function handleMetaUpdate(wt: WarningType) {
    console.log(b);
    if (!b) return;

    if (["warning"].includes(b.data.type)) {
      const updatedData = { ...b.data, warningType: wt };
      dispatch(
        updateMetaData({ id: b.id, data: updatedData as typeof b.data })
      );
    }
    setOpen("");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
          Type <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="ml-1 space-y-0.5"
        >
          {Object.values(warningTypes).map((wt, i) => {
            return (
              <DropdownMenuItem
                onClick={() => handleMetaUpdate(wt.wt)}
                key={i}
                className={cn("cursor-pointer")}
              >
                {wt.icon} {wt.w}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface BlockProps {
  handleKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string
  ): void;
  b: Block;
  isContentEditable: boolean;
}

export function WarningBlock({
  handleKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();
  if (b.data.type != "warning") return;
  const WT = warningTypes[b.data.warningType];

  return (
    <section className={cn(commonClassNames, "border-l-4", WT.color.border)}>
      <h3
        className={cn(
          WT.color.text,
          "ml-4 text-lg font-semibold flex items-center gap-1"
        )}
      >
        {WT.icon}
        {WT.w}
      </h3>
      <p
        className={cn("ml-4", commonClassNames)}
        onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
        id={b.id}
        suppressContentEditableWarning={true}
        suppressHydrationWarning={true}
        onKeyDown={(e) => handleKeyDown(e, b.data.type, b.id)}
        key={b.id}
        contentEditable={isContentEditable}
        onInput={(e) => {
          const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
          dispatch(setBlockInput({ id: b.id, content: html }));
        }}
      ></p>
    </section>
  );
}
