import { dataMapper, listTypeMapper } from "@/text-editor/lib/helper-function";
import { BlockType, ID_LENGTH, ListItem } from "@/text-editor/types/type";
import { Block } from "@/text-editor/types/type";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

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
    setEditorBlocks(state, action: PayloadAction<Block[]>) {
      state.blocks = action.payload;
      state.focusBlockID = action.payload[0].id;
    },

    addBlock(state, action: PayloadAction<{ id: string; type: BlockType }>) {
      // complete with logic of adding the block with some test cases like on empty editor, editor with all different types of blocks.

      const block: Block = {
        id: nanoid(ID_LENGTH),
        data: dataMapper(action.payload.type),
      };

      const targetIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.id
      );

      const targetBlock = state.blocks[targetIndex];
      if (
        ["paragraph", "heading", "warning", "code"].includes(
          action.payload.type
        )
      ) {
        if (targetBlock.data.content.length != 0) {
          state.blocks.splice(targetIndex + 1, 0, block);
        } else {
          state.blocks.splice(targetIndex, 1, block);
        }
        state.focusBlockID = block.id;
      } else if (action.payload.type === "separator") {
        const separatorBlock: Block = {
          id: nanoid(ID_LENGTH),
          data: {
            type: "separator",
            content: "line",
          },
        };
        state.blocks.splice(targetIndex + 1, 0, separatorBlock);
        state.blocks.splice(targetIndex + 2, 0, block);
        state.focusBlockID = block.id;
      } else if (
        ["ordered-list", "unordered-list", "check-list"].includes(
          action.payload.type
        )
      ) {
        const listBlock: Block = {
          id: nanoid(ID_LENGTH),
          data: dataMapper(action.payload.type),
        };

        if (targetBlock.data.content.length == 0) {
          state.blocks.splice(targetIndex, 1, listBlock);
        } else {
          state.blocks.splice(targetIndex + 1, 0, listBlock);
        }
        if (typeof listBlock.data.content === "object")
          state.focusBlockID = listBlock.data.content[0].id;
        else state.focusBlockID = listBlock.id;
      }
    },

    removeBlock(state, action: PayloadAction<{ id: string }>) {
      let blockIndex: number = 0;
      const filteredBlocks: Block[] = [];

      if (
        state.blocks.length == 1 &&
        state.blocks[0].data.type == "separator"
      ) {
        const newBlock: Block = {
          id: nanoid(ID_LENGTH),
          data: {
            type: "paragraph",
            content: "",
            font: "sans",
            align: "left",
          },
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
      action: PayloadAction<{ id: string; direction: "ArrowUp" | "ArrowDown" }>
    ) {
      const blockIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.id
      );
      if (
        action.payload.direction === "ArrowDown" &&
        blockIndex < state.blocks.length - 1
      ) {
        [state.blocks[blockIndex], state.blocks[blockIndex + 1]] = [
          state.blocks[blockIndex + 1],
          state.blocks[blockIndex],
        ];
        state.focusBlockID = state.blocks[blockIndex + 1].id;
      } else if (action.payload.direction === "ArrowUp" && blockIndex > 0) {
        [state.blocks[blockIndex], state.blocks[blockIndex - 1]] = [
          state.blocks[blockIndex - 1],
          state.blocks[blockIndex],
        ];
        state.focusBlockID = state.blocks[blockIndex - 1].id;
      }
    },

    moveCursor(
      state,
      action: PayloadAction<{ id: string; direction: "ArrowUp" | "ArrowDown" }>
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

    setBlockInput(
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) {
      state.blocks = state.blocks.map((b) => {
        if (b.id === action.payload.id && typeof b.data.content === "string") {
          return {
            ...b,
            data: {
              ...b.data,
              content:
                action.payload.content === "<br>" ? "" : action.payload.content,
            } as typeof b.data,
          };
        }
        return b;
      });
    },

    setFocusBlockID(state, action: PayloadAction<{ id: string }>) {
      state.focusBlockID = action.payload.id;
    },

    replaceBlock(state, action: PayloadAction<{ id: string; block: Block }>) {
      state.blocks = state.blocks.map((b) =>
        b.id === action.payload.id ? action.payload.block : b
      );
    },

    updateMetaData(
      state,
      action: PayloadAction<{ id: string; data: Block["data"] }>
    ) {
      // re-write the logic of this function/reducer/action.
      const targetBlockIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.id
      );
      const targetBlock = state.blocks[targetBlockIndex];
      targetBlock.data = { ...targetBlock.data, ...action.payload.data };

      state.blocks.splice(targetBlockIndex, 1, targetBlock);
    },

    setListBlockInput(
      state,
      action: PayloadAction<{ id: string; index: number; content: string }>
    ) {
      state.blocks.forEach((b) => {
        if (b.id === action.payload.id && typeof b.data.content == "object") {
          b.data.content[action.payload.index].listContent =
            action.payload.content == "<br>" ? "" : action.payload.content;
        }
      });
      state.focusBlockID = action.payload.id;
    },

    addListItem(
      state,
      action: PayloadAction<{
        blockID: string;
        itemIndex: number;
      }>
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      const newListItem: ListItem = {
        checked: false,
        id: nanoid(ID_LENGTH),
        listContent: "",
      };
      if (typeof state.blocks[bIndex].data.content !== "object") return;
      state.blocks[bIndex].data.content.splice(
        action.payload.itemIndex + 1,
        0,
        newListItem
      );
      state.focusBlockID = newListItem.id;
    },

    removeListItem(
      state,
      action: PayloadAction<{ blockID: string; itemIndex: number }>
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      if (typeof state.blocks[bIndex].data.content !== "object") return;
      // if listitem's length of the target block is 1, then replace the whole block iwth the paragraph block.
      if (state.blocks[bIndex].data.content.length == 1) {
        const newBlock: Block = {
          id: nanoid(ID_LENGTH),
          data: {
            type: "paragraph",
            content: "",
            align: "left",
            font: "sans",
          },
        };
        state.blocks.splice(bIndex, 1, newBlock);
        state.focusBlockID = newBlock.id;
      } else {
        if (typeof state.blocks[bIndex].data.content !== "object") return;
        // if listitem's length of the target block is not 1, then just remove the target indexed listitem and move the cursor according to the index given.
        state.blocks[bIndex].data.content = state.blocks[
          bIndex
        ].data.content.filter((li, i) => i !== action.payload.itemIndex);
        // Set focus to the previous item or the next one if it was the first
        const newIndex =
          action.payload.itemIndex > 0 ? action.payload.itemIndex - 1 : 0;
        state.focusBlockID =
          state.blocks[bIndex].data.content[newIndex]?.id ||
          state.blocks[bIndex].id;
      }
    },

    // escape the list block if user press "Enter" on empty list
    escapeListBlock(
      state,
      action: PayloadAction<{ blockID: string; itemID: string }>
    ) {
      // first, check if the list item's index is last or not.
      let blockIndex: number = -1;
      let listBlockData: ListItem[] = [];
      state.blocks.map((b, i) => {
        if (b.id === action.payload.blockID) {
          blockIndex = i as number;
          listBlockData = b.data.content as ListItem[];
        }
      });

      if (listBlockData[listBlockData.length - 1].id != action.payload.itemID) {
        return;
      }

      // push the paragraph block just after the list block if list item's index is matched.
      const paraBlock: Block = {
        id: nanoid(ID_LENGTH),
        data: {
          content: "",
          type: "paragraph",
          align: "left",
          font: "sans",
        },
      };
      state.blocks.splice(blockIndex, 0, paraBlock);
      state.focusBlockID = paraBlock.id;
    },

    // replace whole list block if items length is 1 and content is empty with paragraph block
    replaceListItem(
      state,
      action: PayloadAction<{ blockID: string; itemID: string }>
    ) {
      const newBlocks: Block[] = [];
      state.blocks.forEach((b) => {
        if (
          b.id === action.payload.blockID &&
          typeof b.data.content == "object"
        ) {
          const newItems: ListItem[] = [];
          b.data.content.forEach(
            (li) => li.id !== action.payload.itemID && newItems.push(li)
          );
          b.data.content = newItems;
          newBlocks.push(b);
          const paraBlock: Block = {
            id: nanoid(ID_LENGTH),
            data: {
              content: "",
              type: "paragraph",
              font: "sans",
              align: "left",
            },
          };
          newBlocks.push(paraBlock);
          state.focusBlockID = paraBlock.id;
        } else newBlocks.push(b);
        state.blocks = newBlocks;
      });
    },

    checkListItem(
      state,
      action: PayloadAction<{
        blockID: string;
        itemIndex: number;
        checked: boolean;
      }>
    ) {
      const bIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.blockID
      );
      if (typeof state.blocks[bIndex].data.content !== "object") return;
      state.blocks[bIndex].data.content[action.payload.itemIndex].checked =
        action.payload.checked;

      // Add new empty item if checking the last item and it has content
      if (
        action.payload.checked &&
        action.payload.itemIndex ===
          state.blocks[bIndex].data.content.length - 1 &&
        state.blocks[bIndex].data.content[
          action.payload.itemIndex
        ].listContent.trim() !== ""
      ) {
        const newListItem: ListItem = {
          id: nanoid(ID_LENGTH),
          checked: false,
          listContent: "",
        };
        state.blocks[bIndex].data.content.push(newListItem);
        state.focusBlockID = newListItem.id;
      }
    },

    // reducer to change the type of list block
    changeListType(
      state,
      action: PayloadAction<{
        id: string;
        type: BlockType;
      }>
    ) {
      const blockIndex = state.blocks.findIndex(
        (b) => b.id === action.payload.id
      );
      if (blockIndex === -1) return;

      const targetListBlock: Block = state.blocks[blockIndex];

      if (!targetListBlock || !targetListBlock.data) return;
      const newListItems = listTypeMapper(targetListBlock, action.payload.type);
      if (!newListItems) return;
      targetListBlock.data = newListItems;
      state.blocks.splice(blockIndex, 1, targetListBlock);
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
  escapeListBlock,
  replaceListItem,
  checkListItem,
  changeListType,
} = editorSlice.actions;
