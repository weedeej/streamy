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

      const {uid} = authClient.currentUser ?? {uid: ""};
      const docRef = doc(firestoreClient, `/users/${uid}/watchList/${action.payload.id}`);
      setDoc(docRef, action.payload).then(() => {
        showToast(`${action.payload.title} has been added to watch list`, "success")
      });
    },
    removeMovie: (state, action: PayloadAction<{id: string, title: string}>) => {
      state.watchList = state.watchList.filter((m) => m.id !== action.payload.id);

      const {uid} = authClient.currentUser ?? {uid: ""};
      const docRef = doc(firestoreClient, `/users/${uid}/watchList/${action.payload.id}`);
      deleteDoc(docRef).then(() => {
        showToast(`${action.payload.title} has been removed from watch list`, "error")
      })
    }
  }
});

export const {addMovie, removeMovie} = watchListSlice.actions;

export default watchListSlice.reducer;