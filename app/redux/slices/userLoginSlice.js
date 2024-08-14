import { createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from 'cookies-next';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: '',
};

const userLoginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      setCookie('user-session-data', action.payload, {
        maxAge: action.payload.response.user.stsTokenManager.expirationTime,
      });
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      deleteCookie('user-session-data');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  userLoginSlice.actions;
export default userLoginSlice.reducer;

