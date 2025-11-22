"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  changeListType,
  checkListItem,
  setFocusBlockID,
  setListBlockInput,
} from "@/redux/slices/editor.slice";
import { AppDispatch } from "@/redux/store";
import { commonClassNames } from "@/text-editor/Editor";
import { Block, BlockType } from "@/text-editor/types/type";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ChevronRight, List, ListOrdered, ListTodo } from "lucide-react";
import { KeyboardEvent, ReactNode } from "react";
import { useDispatch } from "react-redux";

const listTypes: { icon: ReactNode; label: string; value: BlockType }[] = [
  {
    icon: <List className="h-4 w-4 mr-2" />,
    label: "Ordered List",
    value: "ordered-list",
  },
  {
    icon: <ListOrdered className="h-4 w-4 mr-2" />,
    label: "Unordered List",
    value: "unordered-list",
  },
  {
    icon: <ListTodo className="h-4 w-4 mr-2" />,
    label: "Check List",
    value: "check-list",
  },
];

interface ListPopoverProps {
  id: string;
  setOpen: (value: string) => void;
}

export default function ListPopover({ id, setOpen }: ListPopoverProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex text-sm justify-between items-center w-full px-2 py-1 cursor-pointer hover:bg-muted outline-none rounded-sm">
          List Type <ChevronRight className="h-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="ml-1">
          {listTypes.map((lt, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(changeListType({ id, type: lt.value }));
                  setOpen("");
                }}
              >
                {lt.icon} {lt.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface BlockProps {
  b: Block;
  handleListKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string,
    itemID: string,
    index: number
  ): void;
  isContentEditable: boolean;
}

export function CheckListBlock({
  handleListKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className={cn(commonClassNames, "pl-3")}>
      {typeof b.data.content == "object" &&
        b.data.content.map((li, i) => {
          return (
            <div key={i} className="flex gap-2 items-center">
              <Checkbox
                className="rounded-full h-5 w-5 border cursor-pointer"
                checked={li.checked}
                onCheckedChange={(e) => {
                  if (!li.listContent) return;
                  dispatch(
                    checkListItem({
                      blockID: b.id,
                      itemIndex: i,
                      checked: e == true,
                    })
                  );
                }}
              />
              <p
                key={li.id}
                onFocus={() => dispatch(setFocusBlockID({ id: li.id }))}
                id={li.id}
                suppressContentEditableWarning={true}
                data-placeholder={`List item ${i + 1}`}
                onInput={(e) => {
                  const txt = (e.currentTarget as HTMLElement).innerHTML ?? "";
                  dispatch(
                    setListBlockInput({
                      id: b.id,
                      index: i,
                      content: txt,
                    })
                  );
                }}
                onKeyDown={(e) =>
                  handleListKeyDown(e, b.data.type, b.id, li.id, i)
                }
                className={cn(
                  commonClassNames,
                  "list-disc",
                  li.checked && "text-muted-foreground line-through"
                )}
                contentEditable={isContentEditable && !li.checked}
              ></p>
            </div>
          );
        })}
    </div>
  );
}

export function OrderedListBlock({
  handleListKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <ol className={cn(commonClassNames, "pl-10")}>
      {typeof b.data.content == "object" &&
        b.data.content.map((li, i) => {
          return (
            <li
              key={li.id}
              onFocus={() => dispatch(setFocusBlockID({ id: li.id }))}
              id={li.id}
              suppressContentEditableWarning={true}
              data-placeholder={`List item ${i + 1}`}
              onInput={(e) => {
                const txt = (e.currentTarget as HTMLElement).innerHTML ?? "";
                dispatch(
                  setListBlockInput({
                    id: b.id,
                    index: i,
                    content: txt,
                  })
                );
              }}
              onKeyDown={(e) =>
                handleListKeyDown(e, b.data.type, b.id, li.id, i)
              }
              className={cn("list-decimal", commonClassNames)}
              contentEditable={isContentEditable}
            ></li>
          );
        })}
    </ol>
  );
}

export function UnorderedListBlock({
  handleListKeyDown,
  b,
  isContentEditable,
}: BlockProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <ul className={cn(commonClassNames, "pl-10")}>
      {typeof b.data.content == "object" &&
        b.data.content.map((li, i) => {
          return (
            <li
              key={li.id}
              onFocus={() => dispatch(setFocusBlockID({ id: li.id }))}
              id={li.id}
              suppressContentEditableWarning={true}
              data-placeholder={`List item ${i + 1}`}
              onInput={(e) => {
                const txt = (e.currentTarget as HTMLElement).innerHTML ?? "";
                dispatch(
                  setListBlockInput({
                    id: b.id,
                    index: i,
                    content: txt,
                  })
                );
              }}
              onKeyDown={(e) =>
                handleListKeyDown(e, b.data.type, b.id, li.id, i)
              }
              className={cn(commonClassNames, "list-disc")}
              contentEditable={isContentEditable}
            ></li>
          );
        })}
    </ul>
  );
}
