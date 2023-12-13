import { defaultTrackers } from "@/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface trackerListState {
  trackers: string[],
  default: boolean,
}

const initialState: trackerListState = {
  trackers: defaultTrackers,
  default: true
}

const trackerListSlice = createSlice({
  name: "trackerList",
  initialState,
  reducers: {
    setTrackers: (state, action: PayloadAction<trackerListState>) => {
      state = {...action.payload}
      return state;
    }
  }
});

export const {setTrackers} = trackerListSlice.actions;

export default trackerListSlice.reducer;