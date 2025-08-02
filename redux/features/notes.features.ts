import { apiInstance } from "@/axios.instance";
import { NoteSchema, NoteType } from "@/types/Note.type";
import { createAsyncThunk } from "@reduxjs/toolkit";

// feature to fetch all notes from the database
export const fetchNotes = createAsyncThunk<NoteType[], string>(
  "notes/fetchNotes",
  async (uid, thunkAPI) => {
    try {
      const apiResponse = await apiInstance.get("/api/notes", {
        headers: { uid },
      });
      const notes: NoteType[] = apiResponse.data.notes;
      return notes;
    } catch (error) {
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// feature to create a new note
export const createNote = createAsyncThunk<
  NoteType,
  { uid: string; note: NoteType }
>("notes/create", async ({ uid, note }, thunkAPI) => {
  try {
    const parsedNote = NoteSchema.safeParse(note);
    if (!parsedNote.success) {
      return thunkAPI.rejectWithValue(parsedNote.error.errors[0].message);
    }

    const apiResponse = await apiInstance.post(
      "/api/notes/create",
      { note: parsedNote.data },
      { headers: { uid } }
    );

    return apiResponse.data.result as NoteType;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(error);
  }
});

// feature to update a particular note
export const updateNote = createAsyncThunk<
  NoteType,
  { note: NoteType; uid: string }
>("notes/update", async ({ note, uid }, thunkAPI) => {
  try {
    const parsedNote = NoteSchema.safeParse(note);
    if (!parsedNote.success) {
      return thunkAPI.rejectWithValue(parsedNote.error.errors[0].message);
    }

    const apiResponse = await apiInstance.put(
      "/api/notes/update",
      {
        note: parsedNote.data,
      },
      { headers: { uid } }
    );

    return apiResponse.data.note as NoteType;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(error);
  }
});

export interface ShareNoteProps {
  URL: string;
  sharedNote: NoteType;
  expirationTime: Date;
}

// feature to make a note shareable
export const shareNote = createAsyncThunk<
  ShareNoteProps,
  { note: NoteType; day: string; uid: string }
>("notes/share", async ({ note, day, uid }, thunkAPI) => {
  try {
    const apiResponse = await apiInstance.post(
      "/api/notes/share/generate",
      { note, day },
      { headers: { uid } }
    );

    return apiResponse.data as ShareNoteProps;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(error);
  }
});

// feature to fetch all the shared notes of the user
export const fetchSharedNotes = createAsyncThunk<ShareNoteProps[], string>(
  "sharednotes/fetch",
  async (auth_id, thunkAPI) => {
    try {
      const apiResponse = await apiInstance.get("/api/notes/share", {
        headers: { auth_id },
      });

      const notes = apiResponse.data.sharedNotes;

      return notes;
    } catch (error) {
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// feature to delete both note and shared note (if has)
export const deleteNote = createAsyncThunk<
  NoteType,
  { note_id: string; auth_id: string }
>("notes/delete", async ({ note_id, auth_id }, thunkAPI) => {
  try {
    const apiResponse = await apiInstance.delete("/api/notes/delete", {
      headers: { uid: auth_id, note_id },
    });

    return apiResponse.data.result as NoteType;
  } catch (error) {
    console.error(error as string);
    return thunkAPI.rejectWithValue(error);
  }
});
