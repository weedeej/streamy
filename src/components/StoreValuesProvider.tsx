import { setHomePageMov } from "@/state/homePageMov/homePageMovSlice";
import { RootState } from "@/state/store";
import { setTrackers } from "@/state/trackerList/trackerListSlice";
import { getInitialMovies, getTrackers } from "@/utils";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export function StoreValuesProvider(props: any) {
  const {children} = props;

  
  const isTrackerListDefault = useSelector((state: RootState) => state.trackerList.default);
  const homePageMovies = useSelector((state: RootState) => state.homePageMov.movies);
  const dispatch = useDispatch();

  // Effect for trckers
  useEffect(() => {
    if (!isTrackerListDefault) return;
    getTrackers().then((trackers) => {
      dispatch(setTrackers(trackers))
    });
  }), [];

  // Effect for recommended movies
  useEffect(() => {
    if (homePageMovies !== null) return;
    getInitialMovies.then((movies) => {
      dispatch(setHomePageMov({movies}))
    });
  }), [];

  const child = React.Children.map(children, child => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
  return (<>
    {child}
  </>) 
}