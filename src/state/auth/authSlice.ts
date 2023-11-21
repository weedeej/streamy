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
    }
  }
});

export const {setUser} = authSlice.actions;

export default authSlice.reducer;