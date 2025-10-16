"use client";

import { cn } from "@/lib/utils";
import { JSX, KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { headingClassName } from "./lib/helper-function";
import {
  addBlock,
  moveBlock,
  removeBlock,
  moveCursor,
  setBlockInput,
  setFocusBlockID,
  updateMetaData,
  setListBlockInput,
  addListItem,
  removeListItem,
  replaceListItem,
  checkListItem,
} from "@/redux/slices/editor.slice";
import PopoverWrapper from "./popover/popover-wrapper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { AlignmentType, BlockType } from "./types/type";
import { Asterisk, Copy, Dot } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
const commonClassNames = "outline-none w-full text-lg";

export default function Editor({
  isContentEditable,
}: {
  isContentEditable: boolean;
}) {
  const [openBlockMenu, setOpenBlockMenu] = useState<string>("");
  const [openGripMenu, setOpenGripMenu] = useState<string>("");
  const [selectionToolbar, setSelectionToolbar] = useState<{
    visible: boolean;
    top: number;
    left: number;
  }>({ visible: false, top: 0, left: 0 });
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

  useEffect(() => {
    blocks.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) {
        if (el.innerHTML !== b.content && typeof b.content == "string") {
          el.innerHTML = b.content;
        } else if (typeof b.content == "object") {
          b.content.forEach((li) => {
            const liEl = document.getElementById(li.id);
            if (liEl && liEl.innerHTML !== li.itemContent) {
              liEl.innerHTML = li.itemContent;
            }
          });
        }
      }
    });
  }, [blocks]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const rect = range.getBoundingClientRect();
          setSelectionToolbar({
            visible: true,
            top: rect.top - 50,
            left: rect.left + rect.width / 2 - 50,
          });
        } else {
          setSelectionToolbar({ visible: false, top: 0, left: 0 });
        }
      } else {
        setSelectionToolbar({ visible: false, top: 0, left: 0 });
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  function handleKeyDown(
    e: KeyboardEvent<HTMLElement> | KeyboardEvent<SVGElement>,
    type: BlockType,
    blockID: string
  ) {
    const blockContent = document.getElementById(blockID)?.innerHTML;

    // [Enter + non-empty block content] to add a new block
    if (
      e.key == "Enter" &&
      blockContent?.length != 0 &&
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
      const keyMap: { [key: string]: AlignmentType } = {
        l: "left",
        e: "center",
        j: "justify",
      };
      dispatch(
        updateMetaData({ id: blockID, meta: { alignment: keyMap[e.key] } })
      );
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
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  }

  async function handleCopy(content: string) {
    if (content.length == 0) return;
    await navigator.clipboard.writeText(content);
    toast.info("Copied to clipboard");
  }

  function formatText(command: "B" | "I" | "U") {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    let tag: string;
    switch (command) {
      case "B":
        tag = "strong";
        break;
      case "I":
        tag = "em";
        break;
      case "U":
        tag = "u";
        break;
      default:
        return;
    }

    const commonAncestor = range.commonAncestorContainer;
    const element =
      commonAncestor.nodeType === Node.TEXT_NODE
        ? commonAncestor.parentElement
        : (commonAncestor as Element);
    const formattedElement = element?.closest(tag);

    if (formattedElement) {
      // Unwrap: replace with text content
      const text = formattedElement.textContent || "";
      formattedElement.replaceWith(text);
    } else {
      // Wrap: extract and wrap contents
      const contents = range.extractContents();
      const newElement = document.createElement(tag);
      newElement.appendChild(contents);
      range.insertNode(newElement);
    }

    // Update block content
    const blockElement =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as Element);
    const blockId = blockElement?.closest("[contenteditable]")?.id;
    if (blockId) {
      const html = document.getElementById(blockId)?.innerHTML ?? "";
      dispatch(setBlockInput({ id: blockId, content: html }));
    }
  }

  function renderBlock() {
    return blocks.map((b) => {
      switch (b.type) {
        case "paragraph":
          return (
            <PopoverWrapper
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <p
                onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
                id={b.id}
                suppressContentEditableWarning={true}
                data-placeholder={"Hit '/' for commands..."}
                onInput={(e) => {
                  const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
                  dispatch(setBlockInput({ id: b.id, content: html }));
                }}
                onKeyDown={(e) => handleKeyDown(e, b.type, b.id)}
                className={cn(
                  commonClassNames,
                  `font-${b.meta.font ?? "sans"}`,
                  `text-${b.meta.alignment ?? "left"}`
                )}
                contentEditable={isContentEditable}
              ></p>
            </PopoverWrapper>
          );

        case "heading": {
          const heading = b.meta.heading ?? 1;
          const HeadingTag = `h${heading}` as keyof JSX.IntrinsicElements;
          return (
            <PopoverWrapper
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <HeadingTag
                onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
                data-placeholder={`Heading ${b.meta.heading ?? 1}`}
                id={b.id}
                suppressContentEditableWarning={true}
                suppressHydrationWarning={true}
                onKeyDown={(e) => handleKeyDown(e, b.type, b.id)}
                key={b.id}
                className={cn(
                  commonClassNames,
                  headingClassName(heading),
                  `font-${b.meta.font ?? "sans"}`,
                  `text-${b.meta.alignment ?? "left"}`
                )}
                onInput={(e) => {
                  const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
                  dispatch(setBlockInput({ id: b.id, content: html }));
                }}
                contentEditable={isContentEditable}
              ></HeadingTag>
            </PopoverWrapper>
          );
        }

        case "code": {
          return (
            <PopoverWrapper
              className="group relative"
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <code
                suppressContentEditableWarning={true}
                onInput={(e) => {
                  const html = (e.currentTarget as HTMLElement).innerHTML ?? "";
                  dispatch(setBlockInput({ id: b.id, content: html }));
                }}
                onFocus={() => dispatch(setFocusBlockID({ id: b.id }))}
                data-placeholder="code..."
                id={b.id}
                onKeyDown={(e) => handleKeyDown(e, b.type, b.id)}
                className={cn(
                  commonClassNames,
                  "font-mono px-4 py-2 md:py-4 md:px-9 rounded-md bg-muted whitespace-pre-wrap"
                )}
                contentEditable={isContentEditable}
              ></code>
              <Copy
                className="absolute top-2 right-2 cursor-pointer text-muted-foreground/80 rounded-md h-8 w-8 p-1 group-focus-within:text-accent-foreground group-hover:text-accent-foreground"
                onClick={() =>
                  typeof b.content === "string" && handleCopy(b.content)
                }
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
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              {seperatorMapper[b.meta.seperatorType ?? "line"]}
            </PopoverWrapper>
          );
        }

        case "ordered-list": {
          return (
            <PopoverWrapper
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <ol className={cn(commonClassNames, "pl-10")} id={b.id}>
                {typeof b.content == "object" &&
                  b.content.map((li, i) => {
                    return (
                      <li
                        key={li.id}
                        onFocus={() => dispatch(setFocusBlockID({ id: li.id }))}
                        id={li.id}
                        suppressContentEditableWarning={true}
                        data-placeholder={`List item ${i + 1}`}
                        onInput={(e) => {
                          const txt =
                            (e.currentTarget as HTMLElement).innerHTML ?? "";
                          dispatch(
                            setListBlockInput({
                              id: b.id,
                              index: i,
                              content: txt,
                            })
                          );
                        }}
                        onKeyDown={(e) =>
                          handleListKeyDown(e, b.type, b.id, li.id, i)
                        }
                        className={cn("list-decimal", commonClassNames)}
                        contentEditable={isContentEditable}
                      ></li>
                    );
                  })}
              </ol>
            </PopoverWrapper>
          );
        }

        case "unordered-list": {
          return (
            <PopoverWrapper
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <ul className={cn(commonClassNames, "pl-10")} id={b.id}>
                {typeof b.content == "object" &&
                  b.content.map((li, i) => {
                    return (
                      <li
                        key={li.id}
                        onFocus={() => dispatch(setFocusBlockID({ id: li.id }))}
                        id={li.id}
                        suppressContentEditableWarning={true}
                        data-placeholder={`List item ${i + 1}`}
                        onInput={(e) => {
                          const txt =
                            (e.currentTarget as HTMLElement).innerHTML ?? "";
                          dispatch(
                            setListBlockInput({
                              id: b.id,
                              index: i,
                              content: txt,
                            })
                          );
                        }}
                        onKeyDown={(e) =>
                          handleListKeyDown(e, b.type, b.id, li.id, i)
                        }
                        className={cn(commonClassNames, "list-disc")}
                        contentEditable={isContentEditable}
                      ></li>
                    );
                  })}
              </ul>
            </PopoverWrapper>
          );
        }

        case "check-list": {
          return (
            <PopoverWrapper
              type={b.type}
              key={b.id}
              id={b.id}
              setOpenBlockMenu={setOpenBlockMenu}
              setOpenGripMenu={setOpenGripMenu}
              openBlockMenu={openBlockMenu}
              openGripMenu={openGripMenu}
            >
              <div className={cn(commonClassNames, "pl-3")} id={b.id}>
                {typeof b.content == "object" &&
                  b.content.map((li, i) => {
                    return (
                      <div key={i} className="flex gap-2 items-center">
                        <Checkbox
                          className="rounded-full h-5 w-5 cursor-pointer"
                          checked={li.checked}
                          onCheckedChange={(e) =>
                            dispatch(
                              checkListItem({
                                blockID: b.id,
                                itemIndex: i,
                                checked: e == true,
                              })
                            )
                          }
                        />
                        <p
                          key={li.id}
                          onFocus={() =>
                            dispatch(setFocusBlockID({ id: li.id }))
                          }
                          id={li.id}
                          suppressContentEditableWarning={true}
                          data-placeholder={`List item ${i + 1}`}
                          onInput={(e) => {
                            const txt =
                              (e.currentTarget as HTMLElement).innerHTML ?? "";
                            dispatch(
                              setListBlockInput({
                                id: b.id,
                                index: i,
                                content: txt,
                              })
                            );
                          }}
                          onKeyDown={(e) =>
                            handleListKeyDown(e, b.type, b.id, li.id, i)
                          }
                          className={cn(
                            commonClassNames,
                            li.checked && "text-muted-foreground line-through"
                          )}
                          contentEditable={isContentEditable && !li.checked}
                        ></p>
                      </div>
                    );
                  })}
              </div>
            </PopoverWrapper>
          );
        }

        default:
          return null;
      }
    });
  }

  return (
    <>
      {renderBlock()}
      {selectionToolbar.visible && (
        <div
          style={{
            position: "fixed",
            top: selectionToolbar.top,
            left: selectionToolbar.left,
            zIndex: 1000,
          }}
          className="rounded-md bg-accent/50 p-1 backdrop-blur-md shadow-md transition-opacity"
        >
          <ButtonGroup>
            {/* <Input /> */}
            <ButtonGroup>
              <Button
                size={"icon-sm"}
                variant={"outline"}
                onClick={() => {
                  formatText("B");
                }}
              >
                B
              </Button>
              <Button
                size={"icon-sm"}
                variant={"outline"}
                onClick={() => {
                  formatText("I");
                }}
              >
                I
              </Button>
              <Button
                size={"icon-sm"}
                variant={"outline"}
                onClick={() => {
                  formatText("U");
                }}
              >
                U
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      )}
    </>
  );
}
