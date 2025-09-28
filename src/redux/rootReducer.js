import { combineReducers } from "@reduxjs/toolkit";
import userSliceReducer from "./features/userSlice";

const rootReducer = combineReducers({
  user: userSliceReducer,
});

export default rootReducer;
