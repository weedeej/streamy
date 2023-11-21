import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import watchListReducer from "./watchList/watchListSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchList: watchListReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;