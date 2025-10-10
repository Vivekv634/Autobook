import { ID_LENGTH } from "@/text-editor/lib/block-functions";
import {
  Block,
  BlockType,
  ListItemType,
  MetaType,
} from "@/text-editor/types/type";
import { createSlice, nanoid } from "@reduxjs/toolkit";

interface EditorState {
  blocks: Block[];
  focusBlockID: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: EditorState = {
  blocks: [],
  focusBlockID: null,
  loading: false,
  error: null,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setEditorBlocks(state, action: { payload: Block[] }) {
      state.blocks = action.payload;
      state.focusBlockID = action.payload[0].id;
    },

    addBlock(state, action: { payload: { id: string; type: BlockType } }) {
      const newBlock: Block = {
        id: nanoid(ID_LENGTH),
        type: action.payload.type,
        content: "",
        meta: {},
      };

      const index = state.blocks.findIndex((b) => b.id === action.payload.id);
      // replace the block when the content is empty
      if (
        state.blocks[index].content.length == 0 &&
        state.blocks[index].type != "separator"
      )
        state.blocks.splice(index, 1, newBlock);
      // else push the new block next to the target block
      else state.blocks.splice(index + 1, 0, newBlock);

      state.focusBlockID = newBlock.id;

      if (action.payload.type == "separator") {
        const pBlock: Block = {
          id: nanoid(ID_LENGTH),
          type: "paragraph",
          content: "",
          meta: {},
        };
        state.blocks.splice(index + 1, 0, pBlock);
        state.focusBlockID = pBlock.id;
      } else if (
        ["ordered-list", "unordered-list", "check-list"].includes(
          action.payload.type
        )
      ) {
        const listItem: ListItemType = {
          id: nanoid(ID_LENGTH),
          checked: false,
          itemContent: "",
        };
        state.blocks[index].content = [listItem];
        state.focusBlockID = listItem.id;
      }
    },

    removeBlock(state, action: { payload: { id: string } }) {
      let blockIndex: number = 0;
      const filteredBlocks: Block[] = [];

      if (state.blocks.length == 1 && state.blocks[0].type == "separator") {
        const newBlock: Block = {
          id: nanoid(ID_LENGTH),
          type: "paragraph",
          content: "",
          meta: {},
        };
        state.blocks.splice(0, 1, newBlock);
        state.focusBlockID = newBlock.id;
        return;
      }
      state.blocks.map((b, i) => {
        if (b.id == action.payload.id) {
          blockIndex = i;
        } else {
          filteredBlocks.push(b);
        }
      });
      state.blocks = filteredBlocks;

      if (
        blockIndex == filteredBlocks.length - 1 &&
        filteredBlocks.length > 1
      ) {
        state.focusBlockID = filteredBlocks[blockIndex - 1]?.id;
      } else if (blockIndex == 0 && filteredBlocks.length > 1) {
        state.focusBlockID = filteredBlocks[blockIndex + 1]?.id;
      } else {
        state.focusBlockID = filteredBlocks[blockIndex - 1]?.id;
      }
    },

    moveBlock(
      state,
      action: { payload: { id: string; direction: "ArrowUp" | "ArrowDown" } }
    ) {
      let blockIndex: number = state.blocks.findIndex(
        (b) => b.id == action.payload.id
      );

      const currentElement = document.getElementById(action.payload.id);
      const currentContent = currentElement?.textContent || "";

      const newBlocks = [...state.blocks];

      newBlocks[blockIndex] = {
        ...newBlocks[blockIndex],
        content: currentContent,
      };

      if (
        action.payload.direction == "ArrowDown" &&
        blockIndex < state.blocks.length - 1
      ) {
        const nextElement = document.getElementById(
          newBlocks[blockIndex + 1].id
        );
        const nextContent = nextElement?.textContent || "";
        newBlocks[blockIndex + 1] = {
          ...newBlocks[blockIndex + 1],
          content: nextContent,
        };

        [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
          newBlocks[blockIndex + 1],
          newBlocks[blockIndex],
        ];

        state.blocks = newBlocks;
        ++blockIndex;
      } else if (action.payload.direction == "ArrowUp" && blockIndex > 0) {
        const prevElement = document.getElementById(
          newBlocks[blockIndex - 1].id
        );
        const prevContent = prevElement?.textContent || "";
        newBlocks[blockIndex - 1] = {
          ...newBlocks[blockIndex - 1],
          content: prevContent,
        };

        [newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [
          newBlocks[blockIndex - 1],
          newBlocks[blockIndex],
        ];
        state.blocks = newBlocks;
        --blockIndex;
      } else {
        state.blocks = newBlocks;
        return;
      }

      setTimeout(() => {
        const element = document.getElementById(`${newBlocks[blockIndex].id}`);
        if (element) {
          element.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(element);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 50);
    },

    moveCursor(
      state,
      action: { payload: { id: string; direction: "ArrowUp" | "ArrowDown" } }
    ) {
      const blockIndex: number = state.blocks.findIndex(
        (b) => b.id == action.payload.id
      );
      if (
        action.payload.direction == "ArrowDown" &&
        blockIndex < state.blocks.length - 1
      ) {
        state.focusBlockID = state.blocks[blockIndex + 1].id;
      } else if (action.payload.direction == "ArrowUp" && blockIndex > 0) {
        state.focusBlockID = state.blocks[blockIndex - 1].id;
      }
    },

    setBlockInput(state, action: { payload: { id: string; content: string } }) {
      state.blocks = state.blocks.map((b) => {
        if (b.id === action.payload.id)
          return { ...b, content: action.payload.content };
        else return b;
      });
    },

    setFocusBlockID(state, action: { payload: { id: string } }) {
      state.focusBlockID = action.payload.id;
    },

    replaceBlock(state, action: { payload: { id: string; block: Block } }) {
      state.blocks = state.blocks.map((b) =>
        b.id === action.payload.id ? action.payload.block : b
      );
    },

    updateMetaData(
      state,
      action: { payload: { id: string; meta: Partial<MetaType> } }
    ) {
      const newBlocks: Block[] = [];
      state.blocks.forEach((b) =>
        b.id === action.payload.id
          ? newBlocks.push({
              ...b,
              meta: { ...b.meta, ...action.payload.meta },
            })
          : newBlocks.push(b)
      );
      state.blocks = newBlocks;
      state.focusBlockID = action.payload.id;
    },

    setListBlockInput(
      state,
      action: { payload: { id: string; index: number; content: string } }
    ) {
      state.blocks.forEach((b) => {
        if (b.id === action.payload.id && typeof b.content == "object") {
          b.content[action.payload.index].itemContent = action.payload.content;
        }
      });
      state.focusBlockID = action.payload.id;
    },

    addListItem(
      state,
      action: {
        payload: { blockID: string; itemIndex: number };
      }
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      const newListItem: ListItemType = {
        checked: false,
        id: nanoid(ID_LENGTH),
        itemContent: "",
      };
      if (typeof state.blocks[bIndex].content !== "object") return;
      state.blocks[bIndex].content.splice(
        action.payload.itemIndex + 1,
        0,
        newListItem
      );
      state.focusBlockID = newListItem.id;
    },

    removeListItem(
      state,
      action: { payload: { blockID: string; itemIndex: number } }
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      if (typeof state.blocks[bIndex].content !== "object") return;
      // if listitem's length of the target block is 1, then replace the whole block iwth the paragraph block.
      if (state.blocks[bIndex].content.length == 1) {
        const newBlock: Block = {
          id: nanoid(ID_LENGTH),
          type: "paragraph",
          content: "",
          meta: {},
        };
        state.blocks.splice(bIndex, 1, newBlock);
        state.focusBlockID = newBlock.id;
      } else {
        if (typeof state.blocks[bIndex].content !== "object") return;
        // if listitem's length of the target block is not 1, then just remove the target indexed listitem and move the cursor according to the index given.
        state.blocks[bIndex].content = state.blocks[bIndex].content.filter(
          (li, i) => i !== action.payload.itemIndex
        );
        // Set focus to the previous item or the next one if it was the first
        const newIndex =
          action.payload.itemIndex > 0 ? action.payload.itemIndex - 1 : 0;
        state.focusBlockID =
          state.blocks[bIndex].content[newIndex]?.id || state.blocks[bIndex].id;
      }
    },

    // replace whole list block if items length is 1 and content is empty with paragraph block
    replaceListItem(
      state,
      action: { payload: { blockID: string; itemID: string } }
    ) {
      const newBlocks: Block[] = [];
      state.blocks.forEach((b) => {
        if (b.id === action.payload.blockID && typeof b.content == "object") {
          const newItems: ListItemType[] = [];
          b.content.forEach(
            (li) => li.id !== action.payload.itemID && newItems.push(li)
          );
          b.content = newItems;
          newBlocks.push(b);
          const paraBlock: Block = {
            id: nanoid(ID_LENGTH),
            content: "",
            meta: {},
            type: "paragraph",
          };
          newBlocks.push(paraBlock);
          state.focusBlockID = paraBlock.id;
        } else newBlocks.push(b);
        state.blocks = newBlocks;
      });
    },

    checkListItem(
      state,
      action: {
        payload: { blockID: string; itemIndex: number; checked: boolean };
      }
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      if (typeof state.blocks[bIndex].content != "object") return;
      state.blocks[bIndex].content[action.payload.itemIndex].checked =
        action.payload.checked;
    },
  },
});

export const {
  setEditorBlocks,
  setBlockInput,
  addBlock,
  removeBlock,
  moveBlock,
  moveCursor,
  setFocusBlockID,
  updateMetaData,
  replaceBlock,
  setListBlockInput,
  addListItem,
  removeListItem,
  replaceListItem,
  checkListItem,
} = editorSlice.actions;
