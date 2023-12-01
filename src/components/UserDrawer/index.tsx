import { httpConfig } from "@/constants";
import { authClient, firestoreClient } from "@/firebaseConfig/firebase";
import { changeUserValue, setUser } from "@/state/auth/authSlice";
import { RootState } from "@/state/store";
import { showToast, stringAvatar } from "@/utils";
import { CopyAll } from "@mui/icons-material";
import { Avatar, Button, Card, CardHeader, CircularProgress, Drawer, IconButton, Paper, Stack, Switch, Typography } from "@mui/material";
import axios from "axios";
import { doc, collection, updateDoc } from "firebase/firestore";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer(props: UserDrawerProps) {
  const { isOpen, onClose } = props;
  const user = useSelector((state: RootState) => state.auth.user);
  const watchList = useSelector((state: RootState) => state.watchList.watchList)
  const firebaseUser = useSelector((state: RootState) => state.auth.firebaseUser);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const dispatch = useDispatch();

  if (!user || !firebaseUser) return null;

  const watchListUrl = `${httpConfig.uri}/list/${user.watchListId}`

  function onWatchListCopy() {
    navigator.clipboard.writeText(watchListUrl);
    showToast("Link Copied!", "success");
  }

  async function onPublicSwitchChange(e: ChangeEvent, isChecked: boolean) {
    const accessToken = firebaseUser!.stsTokenManager!.accessToken;

    setIsSwitchLoading(true);
    axios.post(`${httpConfig.uri}/api/users/${user!._id}/watchList/update`, {
      isPublic: isChecked
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }).then(() => {
      const userDocRef = doc(collection(firestoreClient, "users"), user!._id);
      updateDoc(userDocRef, {isWatchlistPublic: isChecked}).then(() => {
        dispatch(changeUserValue({ key: "isWatchlistPublic", value: isChecked }));
        showToast(`Watchlist has been made ${isChecked ? "public" : "private"}`, "success");
        setIsSwitchLoading(false);
      })
    });
  }

  function onSignout() {
    authClient.signOut();
    onClose();
  }
  return (<>
    <Drawer open={isOpen} anchor="right" onClose={onClose}>
      <Paper sx={{ width: 280, height: "100%" }} elevation={0}>
        <Stack padding={1} gap={1} height="inherit" boxSizing="border-box">
          <Stack
            borderRadius={2}
            direction="row"
            alignItems="center"
            gap={2}
            sx={(theme) => ({ backgroundColor: theme.palette.grey[300] })}
            p={1}>
            <Avatar {...stringAvatar(user.name)} />
            <Stack gap={0}>
              <Typography variant="body1" fontWeight={700}>{user.name}</Typography>
              <Typography variant="caption">{user.email}</Typography>
            </Stack>
          </Stack>
          <Stack
            gap={0}
            borderRadius={2}
            p={1}
            sx={(theme) => ({ backgroundColor: theme.palette.grey[300] })}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">
                Public Watchlist
              </Typography>
              <Stack direction="row" gap={1} alignItems="center">
                {isSwitchLoading && <CircularProgress size={16} />}
                <Switch checked={user.isWatchlistPublic} onChange={onPublicSwitchChange} disabled={isSwitchLoading} />
              </Stack>
            </Stack>
            <Stack gap={0}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Watchlist URL:
                </Typography>
                <IconButton size="small" title="Copy Link" onClick={onWatchListCopy}>
                  <CopyAll />
                </IconButton>
              </Stack>
              <Typography fontWeight={700} variant="subtitle2" p={1} borderRadius={1} sx={(theme) => ({ backgroundColor: theme.palette.grey[400] })}>
                {watchListUrl}
              </Typography>
            </Stack>
          </Stack>
          <Stack justifyContent="end" height="100%" gap={1}>
            <Stack
              gap={0}
              p={1}
              sx={(theme) => ({ backgroundColor: theme.palette.grey[300] })}
            >
              <Typography fontWeight={700}>User Summary</Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>Watchlist Count</Typography>
                <Typography fontWeight={700}>{watchList.length}</Typography>
              </Stack>
            </Stack>
            <Button color="error" variant="contained" onClick={onSignout}>Logout</Button>
          </Stack>
          {/* <Stack
            borderRadius={2}
            direction="row"
            alignItems="center"
            gap={2}
            sx={(theme) => ({ backgroundColor: theme.palette.grey[300] })}
            p={1}>
              <Typography variant="h5">Watch List</Typography>
          </Stack> */}
        </Stack>
      </Paper>
    </Drawer>
  </>)
}