import { combineReducers } from "@reduxjs/toolkit";
import userLoginSlice from "../slices/userLoginSlice";
import userRegisterSlice from "../slices/userRegisterSlice";

export const rootReducer = combineReducers({
    userLogin: userLoginSlice,
    userRegister:userRegisterSlice
});