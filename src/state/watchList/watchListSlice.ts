import { Movie } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface watchListState {
  watchList: Movie[]
}

const initialState: watchListState = {
  watchList: []
}

const watchListSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.watchList = [...state.watchList, action.payload];
    },
    removeMovie: (state, action: PayloadAction<{id: string}>) => {
      state.watchList = state.watchList.filter((m) => m.id !== action.payload.id);
    }
  }
});

export const {addMovie, removeMovie} = watchListSlice.actions;

export default watchListSlice.reducer;