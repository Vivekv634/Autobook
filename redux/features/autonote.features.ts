import { apiInstance } from "@/axios.instance";
import { AutoNoteSchema, AutoNoteType } from "@/types/AutoNote.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const createAutoNote = createAsyncThunk<AutoNoteType, AutoNoteType>(
  "autonote/create",
  async (autonote, thunkAPI) => {
    try {
      if (autonote.days.length < 1)
        return thunkAPI.rejectWithValue("Select atleast 1 day.");

      const parsedAutoNoteData = AutoNoteSchema.safeParse(autonote);
      if (!parsedAutoNoteData.success) {
        console.log(parsedAutoNoteData.data);
        return thunkAPI.rejectWithValue(
          parsedAutoNoteData.error?.errors[0].message
        );
      }

      console.log("Parsed AutoNote Data:", parsedAutoNoteData.data);

      const apiResponse = await apiInstance.post("api/autonotes/create", {
        autonote: parsedAutoNoteData.data,
      });
      return apiResponse.data.result as AutoNoteType;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.message || "Something went wrong. Try again later!";
        return thunkAPI.rejectWithValue(errorMessage);
      }
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchAutoNotes = createAsyncThunk<AutoNoteType[], string>(
  "autonote/fetch",
  async (uid, thunkAPI) => {
    try {
      const apiResponse = await apiInstance.get("api/autonotes", {
        headers: { uid },
      });
      return apiResponse.data.result as AutoNoteType[];
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.message || "Something went wrong. Try again later!";
        return thunkAPI.rejectWithValue(errorMessage);
      }
      console.error(error as string);
      return thunkAPI.rejectWithValue(error);
    }
  }
);
