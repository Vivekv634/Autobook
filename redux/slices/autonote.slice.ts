import { createSlice } from "@reduxjs/toolkit";
import { AutoNoteType } from "@/types/AutoNote.types";
import { createAutoNote, fetchAutoNotes } from "../features/autonote.features";

interface AutoNoteState {
  autonotes: AutoNoteType[];
  loading: boolean;
  error: string | null;
}

const initialState: AutoNoteState = {
  autonotes: [],
  loading: false,
  error: null,
};

export const autoNoteSlice = createSlice({
  name: "autonote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAutoNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAutoNote.fulfilled, (state, action) => {
        state.autonotes.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(createAutoNote.rejected, (state, action) => {
        state.error = action.error as string;
        state.loading = false;
      })
      .addCase(fetchAutoNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutoNotes.fulfilled, (state, action) => {
        state.autonotes = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAutoNotes.rejected, (state, action) => {
        state.error = action.error as string;
        state.loading = false;
      });
  },
});

export default autoNoteSlice.reducer;
