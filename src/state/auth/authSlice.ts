import { StreamyUser } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: StreamyUser | null
}

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<StreamyUser | null>) => {
      state.user = action.payload
    },
    changeUserValue(state, action: PayloadAction<{key: keyof StreamyUser, value: any}>) {
      if (!state.user) return;
      const {key, value} = action.payload;
      const user: StreamyUser = {...state.user};
      // @ts-ignore
      user[key] = value;
      state.user = user;
    }
  }
});

export const {setUser, changeUserValue} = authSlice.actions;

export default authSlice.reducer;