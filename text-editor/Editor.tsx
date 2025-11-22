"use client";

import { KeyboardEvent, ReactNode, useEffect, useLayoutEffect, useState } from "react";
import {
  addBlock,
  moveBlock,
  removeBlock,
  moveCursor,
  addListItem,
  removeListItem,
  replaceListItem,
  escapeListBlock,
} from "@/redux/slices/editor.slice";
import PopoverWrapper from "./popover/popover-wrapper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { BlockType } from "./types/type";
import { Asterisk, Dot } from "lucide-react";
import { ParagraphBlock } from "./popover/popover-types/paragraph";
import { HeadingBlock } from "./popover/popover-types/heading";
import {
  CheckListBlock,
  OrderedListBlock,
  UnorderedListBlock,
} from "./popover/popover-types/list";
import CodeBlock from "./popover/popover-types/code";
import { WarningBlock } from "./popover/popover-types/warning";

export const commonClassNames = "outline-none w-full text-lg";

export default function Editor({
  isContentEditable,
}: {
  isContentEditable: boolean;
}) {
  const [openBlockMenu, setOpenBlockMenu] = useState<string>("");
  const [openGripMenu, setOpenGripMenu] = useState<string>("");
  const { blocks, focusBlockID } = useSelector(
    (state: RootState) => state.editor
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (focusBlockID) {
      const element = document.getElementById(focusBlockID);
      if (element) {
        element.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(element);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [focusBlockID]);

  useLayoutEffect(() => {
    blocks.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) {
        if (
          el.innerHTML !== b.data.content &&
          typeof b.data.content === "string"
        ) {
          el.innerHTML = b.data.content;
        } else if (Array.isArray(b.data.content)) {
          b.data.content.forEach((li) => {
            const liElement = document.getElementById(li.id);
            if (liElement) {
              if (
                liElement.innerHTML !== li.listContent &&
                typeof li.listContent === "string"
              ) {
                liElement.innerHTML = li.listContent;
              }
            }
          });
        }
      }
    });
  }, [blocks]);

  function handleKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string
  ) {
    const blockContent = document.getElementById(blockID)?.innerHTML;

    // [Enter + non-empty block content] to add a new block
    if (
      e.key == "Enter" &&
      blockContent &&
      blockContent.trim().length != 0 &&
      !e.shiftKey &&
      !["code"].includes(type)
    ) {
      e.preventDefault();
      dispatch(addBlock({ id: blockID, type: "paragraph" }));
    }

    // [Backspace + empty content] to remove a block else remove block content
    else if (e.key == "Backspace" && blockContent?.length == 0) {
      e.preventDefault();
      dispatch(removeBlock({ id: blockID }));
    }

    // [CTRL + ArrowUp/ArrowDown] to move whole block
    else if (e.ctrlKey && (e.key == "ArrowUp" || e.key == "ArrowDown")) {
      dispatch(moveBlock({ id: blockID, direction: e.key }));
    }

    // [ALT + ArrowUp/ArrowDown] to move cursor up and down across blocks
    else if (e.altKey && (e.key == "ArrowUp" || e.key == "ArrowDown")) {
      dispatch(moveCursor({ id: blockID, direction: e.key }));
    }

    // ['/' on Empty content block] triggers the plus dropdown
    else if (e.key == "/" && blockContent?.length == 0) {
      e.preventDefault();
      setOpenBlockMenu(blockID);
    }

    // paragraph and heading key bindings
    // for text alignment
    else if (
      ["paragraph", "heading"].includes(type) &&
      e.ctrlKey &&
      ["l", "e", "j"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      // const keyMap: { [key: string]: AlignmentType } = {
      //   l: "left",
      //   e: "center",
      //   j: "justify",
      // };
      // dispatch(
      //   updateMetaData({ id: blockID, meta: { alignment: keyMap[e.key] } })
      // );
    } else {
      return;
    }
  }

  function handleListKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string,
    itemID: string,
    index: number
  ) {
    const blockContent = document.getElementById(itemID)?.innerHTML;
    // hit 'Enter' on non-empty list item to make a next list item
    if (
      e.key == "Enter" &&
      ["ordered-list", "unordered-list", "check-list"].includes(type) &&
      blockContent?.length != 0
    ) {
      e.preventDefault();
      dispatch(addListItem({ blockID, itemIndex: index }));
    } else if (
      e.key == "Enter" &&
      ["ordered-list", "unordered-list", "check-list"].includes(type) &&
      blockContent?.length == 0
    ) {
      e.preventDefault();
      dispatch(replaceListItem({ blockID, itemID }));
    }

    // hit 'Backspace' on empty list item to remove/delete it.
    else if (
      e.key == "Backspace" &&
      ["ordered-list", "unordered-list", "check-list"].includes(type) &&
      blockContent?.length == 0
    ) {
      e.preventDefault();
      dispatch(removeListItem({ blockID, itemIndex: index }));
    }

    // hit 'Enter' on empty list item to make a paragraph block by default.
    else if (
      e.key == "Enter" &&
      ["ordered-list", "unordered-list", "check-list"].includes(type) &&
      blockContent?.length == 0
    ) {
      dispatch(escapeListBlock({ blockID, itemID }));
    }
  }

  function renderBlock() {
    return blocks.map((b) => {
      switch (b.data.type) {
        case "paragraph":
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <ParagraphBlock
                isContentEditable={isContentEditable}
                b={b}
                key={b.id}
                handleKeyDown={handleKeyDown}
              />
            </PopoverWrapper>
          );

        case "heading": {
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <HeadingBlock
                isContentEditable={isContentEditable}
                b={b}
                key={b.id}
                handleKeyDown={handleKeyDown}
              />
            </PopoverWrapper>
          );
        }

        case "code": {
          return (
            <PopoverWrapper
              className="group relative"
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <CodeBlock
                key={b.id}
                b={b}
                isContentEditable={isContentEditable}
                handleKeyDown={handleKeyDown}
              />
            </PopoverWrapper>
          );
        }

        case "separator": {
          const seperatorMapper: {
            [key: string]: ReactNode;
          } = {
            dots: (
              <div className="flex items-center justify-center w-full text-muted-foreground">
                <Dot />
                <Dot />
                <Dot />
              </div>
            ),
            asterisk: (
              <div className="flex items-center justify-center w-full text-muted-foreground">
                <Asterisk />
                <Asterisk />
                <Asterisk />
              </div>
            ),
            line: <hr className="w-full border-2 border-muted" />,
          };
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              {seperatorMapper[b.data.content ?? "line"]}
            </PopoverWrapper>
          );
        }

        case "ordered-list": {
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <OrderedListBlock
                key={b.id}
                b={b}
                isContentEditable={isContentEditable}
                handleListKeyDown={handleListKeyDown}
              />
            </PopoverWrapper>
          );
        }

        case "unordered-list": {
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <UnorderedListBlock
                key={b.id}
                b={b}
                isContentEditable={isContentEditable}
                handleListKeyDown={handleListKeyDown}
              />
            </PopoverWrapper>
          );
        }

        case "check-list": {
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <CheckListBlock
                key={b.id}
                b={b}
                isContentEditable={isContentEditable}
                handleListKeyDown={handleListKeyDown}
              />
            </PopoverWrapper>
          );
        }

        case "warning": {
          return (
            <PopoverWrapper
              type={b.data.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <WarningBlock
                key={b.id}
                b={b}
                isContentEditable={isContentEditable}
                handleKeyDown={handleKeyDown}
              />
            </PopoverWrapper>
          );
        }

        default:
          return null;
      }
    });
  }

  return renderBlock();
}
