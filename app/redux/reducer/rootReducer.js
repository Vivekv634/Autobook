import { combineReducers } from '@reduxjs/toolkit';
import userLoginSlice from '../slices/userLoginSlice';
import noteSlice from '../slices/noteSlice';

export const rootReducer = combineReducers({
  userLogin: userLoginSlice,
  note: noteSlice,
});

