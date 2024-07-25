import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
}

const userRegisterSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        registerStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
});

export const { registerStart, registerSuccess, registerFailure } = userRegisterSlice.actions;
export default userRegisterSlice.reducer;