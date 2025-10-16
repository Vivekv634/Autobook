"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { setEditorBlocks } from "@/redux/slices/editor.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { AlignmentType, Block, MetaType } from "@/text-editor/types/type";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  ChevronRight,
} from "lucide-react";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

const ALIGNMENT: { icon: ReactNode; value: AlignmentType }[] = [
  {
    icon: <AlignLeft />,
    value: "left",
  },
  {
    icon: <AlignCenter />,
    value: "center",
  },
  {
    icon: <AlignJustify />,
    value: "justify",
  },
];

interface TextAlignmentDropdownProps {
  id: string;
  exclude: AlignmentType[];
  setOpen: (value: string) => void;
}

export default function TextAlignmentDropdown({
  id,
  setOpen,
  exclude,
}: TextAlignmentDropdownProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { blocks } = useSelector((state: RootState) => state.editor);

  function handleMetaChange(id: string, meta: MetaType) {
    const newBlocks: Block[] = [];
    blocks.forEach((b) =>
      b.id === id
        ? newBlocks.push({ ...b, meta: { ...b.meta, ...meta } })
        : newBlocks.push(b)
    );

    dispatch(setEditorBlocks(newBlocks));
    setOpen("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full p-2 cursor-pointer hover:bg-muted outline-none rounded-sm">
        Align <ChevronRight className="h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="ml-1">
        {ALIGNMENT.filter(
          (alignment) => !Array.from(exclude).includes(alignment.value)
        ).map((a, i) => {
          return (
            <DropdownMenuItem
              key={i}
              onClick={() => handleMetaChange(id, { alignment: a.value })}
            >
              {a.icon} {a.value[0].toUpperCase() + a.value.slice(1)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
