import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  deletedNotes: [],
  notebooks: {},
  tagsData: {},
  user: {},
  autoNotes: [],
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    removeNotes: (state) => {
      state.notes = null;
    },
    setDeletedNotes: (state, action) => {
      state.deletedNotes = action.payload;
    },
    removeDeletedNotes: (state) => {
      state.deletedNotes = [];
    },
    setNoteBooks: (state, action) => {
      state.notebooks = action.payload;
    },
    setTagsData: (state, action) => {
      state.tagsData = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAutoNotes: (state, action) => {
      state.autoNotes = action.payload;
    },
  },
});

export const {
  setNotes,
  removeNotes,
  setDeletedNotes,
  removeDeletedNotes,
  setNoteBooks,
  setTagsData,
  setUser,
  setAutoNotes,
} = noteSlice.actions;
export default noteSlice.reducer;
