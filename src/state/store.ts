import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import watchListReducer from "./watchList/watchListSlice";
import trackerListReducer from "./trackerList/trackerListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchList: watchListReducer,
    trackerList: trackerListReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;