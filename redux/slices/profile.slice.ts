import { UserType } from "@/types/User.type";
import { createSlice } from "@reduxjs/toolkit";
import { loginUserProfile, registerUser } from "../features/profile.features";
import { updateUser } from "../features/profile.features";

interface initialStateType {
  user: UserType | null;
  uid: string;
  loading: boolean;
  error: string | null;
}

const initialState: initialStateType = {
  uid: "",
  user: null,
  loading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: "users/profile",
  initialState,
  reducers: {
    setProfile: (
      state,
      action: { payload: { user: UserType; uid: string } }
    ) => {
      state.user = action.payload.user;
      state.uid = action.payload.uid;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loginUserProfile.fulfilled,
        (state, action: { payload: { user: UserType; uid: string } }) => {
          state.user = action.payload.user;
          state.uid = action.payload.uid;
          state.loading = false;
        }
      )
      .addCase(loginUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
