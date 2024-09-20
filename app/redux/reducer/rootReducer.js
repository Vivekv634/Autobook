import { combineReducers } from '@reduxjs/toolkit';
import noteSlice from '../slices/noteSlice';

export const rootReducer = combineReducers({
  note: noteSlice,
});
