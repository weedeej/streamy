import { authClient, firestoreClient } from "@/firebaseConfig/firebase";
import { Movie } from "@/types";
import { showToast } from "@/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

interface watchListState {
  watchList: Movie[]
}

const initialState: watchListState = {
  watchList: []
}

const watchListSlice = createSlice({
  name: "watchList",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.watchList = [...state.watchList, action.payload];
      return state;
    },
    removeMovie: (state, action: PayloadAction<{id: string, title: string}>) => {
      state.watchList = state.watchList.filter((m) => m.id !== action.payload.id);
      return state;
    },
    setWatchList: (state, action: PayloadAction<Movie[]>) => {
      state.watchList = action.payload;
      return state;
    }
  }
});

export const {addMovie, removeMovie, setWatchList} = watchListSlice.actions;

export default watchListSlice.reducer;