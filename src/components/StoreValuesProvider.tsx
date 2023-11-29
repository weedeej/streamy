import { authClient, firestoreClient } from "@/firebaseConfig/firebase";
import { setUser } from "@/state/auth/authSlice";
import { setHomePageMov } from "@/state/homePageMov/homePageMovSlice";
import { RootState } from "@/state/store";
import { setTrackers } from "@/state/trackerList/trackerListSlice";
import { StreamyUser } from "@/types";
import { getInitialMovies, getTrackers, showToast } from "@/utils";
import { Typography } from "@mui/material";
import { sendEmailVerification } from "firebase/auth";
import { doc, collection, getDocFromServer, setDoc } from "firebase/firestore";
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

  // Effect for authstate
  useEffect(() => {
    authClient.onAuthStateChanged(async (user) => {
      if (!user) return dispatch(setUser(null));
      if (!user.emailVerified) {
        sendEmailVerification(user);
        showToast("We have sent you a verification email. Please check inbox or spam", "warning")
        authClient.signOut();
        return;
      }
      const userDocRef = doc(collection(firestoreClient, "users"), user.uid);
      const streamyUserSnap = await getDocFromServer(userDocRef);
      if (streamyUserSnap.exists()) {
        const streamyUser = streamyUserSnap.data() as StreamyUser
        dispatch(setUser(streamyUser));
        showToast(<Typography>Welcome Back, <b>{streamyUser.name}</b></Typography>, "success");
        return;
      }
      const streamyUser: StreamyUser = {
        _id: user.uid,
        name: user.displayName ?? `NEW USER`,
        watchListCount: 0
      }
      await setDoc(userDocRef, streamyUser);
      dispatch(setUser(streamyUser));
      showToast(<Typography>Welcome Back, <b>{streamyUser.name}</b></Typography>, "success");
    });
  }, []);

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