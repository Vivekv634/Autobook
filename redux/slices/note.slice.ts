import { NoteType } from "@/types/Note.type";
import { createSlice } from "@reduxjs/toolkit";
import {
  createNote,
  deleteNote,
  fetchNotes,
  fetchSharedNotes,
  shareNote,
  ShareNoteProps,
  updateNote,
} from "../features/notes.features";

interface NoteState {
  sharedNotes?: ShareNoteProps[];
  notes: NoteType[];
  loading: boolean;
  error: string | null;
}

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null,
  sharedNotes: [],
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetch notes builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // create note builder
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update note builder
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.map((note: NoteType) => {
          if (note.note_id == action.payload.note_id) return action.payload;
          else return note;
        });
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // share note builder
      .addCase(shareNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(shareNote.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedNotes?.push(action.payload);
      })
      .addCase(shareNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetch shared notes builder
      .addCase(fetchSharedNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSharedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedNotes = [...action.payload];
      })
      .addCase(fetchSharedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete note builder
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        const filteredNotes = [...state.notes].filter((note: NoteType) => {
          if (note.note_id != action.payload.note_id) return note;
        });
        state.notes = filteredNotes;

        if (state.sharedNotes == undefined) return;

        const filteredSharedNotes: ShareNoteProps[] = [
          ...state.sharedNotes,
        ].filter((item: ShareNoteProps) => {
          if (item.sharedNote.note_id != action.payload.note_id) return item;
        });

        state.sharedNotes = filteredSharedNotes;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default noteSlice.reducer;
