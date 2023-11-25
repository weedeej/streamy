import { Movie } from "@/types"
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type homePageMovState = {
  movies: Movie[] | null;
}

const initialState: homePageMovState = {
  movies: null
}

const slice = createSlice({
  name: "homePageMov",
  initialState,
  reducers: {
    setHomePageMov: (state, action: PayloadAction<homePageMovState>) => {
      state.movies = action.payload.movies;
    }
  }
})

export const {setHomePageMov} = slice.actions;
export default slice.reducer;