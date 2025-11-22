"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { updateMetaData } from "@/redux/slices/editor.slice";
import { AppDispatch, RootState } from "@/redux/store";
import { AlignmentType } from "@/text-editor/types/type";
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
  const b = blocks.find((b) => b.id === id);

  function handleMetaUpdate(align: AlignmentType) {
    if (!b) return;

    if (["paragraph", "heading"].includes(b.data.type)) {
      const updatedData = { ...b.data, align };
      dispatch(
        updateMetaData({ id: b.id, data: updatedData as typeof b.data })
      );
    }
    setOpen("");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
        Align <ChevronRight className="h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="ml-1">
        {ALIGNMENT.filter(
          (alignment) => !Array.from(exclude).includes(alignment.value)
        ).map((a, i) => {
          return (
            <DropdownMenuItem key={i} onClick={() => handleMetaUpdate(a.value)}>
              {a.icon} {a.value[0].toUpperCase() + a.value.slice(1)}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
