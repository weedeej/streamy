import { StreamyUser } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

type FirebaseUserObject = User & {
  stsTokenManager?: {accessToken: string}
}

interface AuthState {
  user: StreamyUser | null,
  firebaseUser: FirebaseUserObject | null
}

const initialState: AuthState = {
  user: null,
  firebaseUser: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<StreamyUser | null>) => {
      state.user = action.payload
      return state;
    },
    setFirebaseUser: (state, action: PayloadAction<FirebaseUserObject | null>) => {
      state.firebaseUser = action.payload;
      return state;
    },
    changeUserValue: (state, action: PayloadAction<{key: keyof StreamyUser, value: any}>) => {
      if (!state.user) return;
      const {key, value} = action.payload;
      const user: StreamyUser = {...state.user};
      // @ts-ignore
      user[key] = value;
      state.user = user;
      return state;
    }
  }
});

export const {setUser, changeUserValue, setFirebaseUser} = authSlice.actions;

export default authSlice.reducer;