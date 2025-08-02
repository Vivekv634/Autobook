import { combineReducers } from "@reduxjs/toolkit";
import { noteSlice } from "./slices/note.slice";
import { profileSlice } from "./slices/profile.slice";
import { autoNoteSlice } from "./slices/autonote.slice";

export const rootReducer = combineReducers({
  notes: noteSlice.reducer,
  user: profileSlice.reducer,
  autonote: autoNoteSlice.reducer,
});
