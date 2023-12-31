import { httpConfig } from "@/constants";
import { authClient, firestoreClient } from "@/firebaseConfig/firebase";
import { changeUserValue, setUser } from "@/state/auth/authSlice";
import { RootState } from "@/state/store";
import { showToast, stringAvatar } from "@/utils";
import { CopyAll, Edit, Loop, Refresh } from "@mui/icons-material";
import { Avatar, Button, Card, CardHeader, CircularProgress, Drawer, IconButton, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { doc, collection, updateDoc } from "firebase/firestore";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer(props: UserDrawerProps) {
  const { isOpen, onClose } = props;
  const user = useSelector((state: RootState) => state.auth.user);
  const firebaseUser = useSelector((state: RootState) => state.auth.firebaseUser);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const nameFieldRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  if (!user || !firebaseUser) return null;

  const watchListUrl = `${httpConfig.uri}/?list=${user.watchListId}`

  function onWatchListCopy() {
    navigator.clipboard.writeText(watchListUrl);
    showToast("Link Copied!", "success");
  }

  async function onPublicSwitchChange(e: any, isChecked: boolean) {
    const accessToken = firebaseUser!.stsTokenManager!.accessToken;

    setIsSwitchLoading(true);
    const promiseHelper = new Promise((res, reject) => {
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
        updateDoc(userDocRef, { isWatchlistPublic: isChecked }).then(() => {
          dispatch(changeUserValue({ key: "isWatchlistPublic", value: isChecked }));
          showToast(`Watchlist has been made ${isChecked ? "public" : "private"}`, "success");
          setIsSwitchLoading(false);
          res(true);
        })
      });
    });
    return promiseHelper;
  }

  function onNameFieldSubmit(e: FormEvent) {
    e.preventDefault();
    const userDocRef = doc(collection(firestoreClient, "users"), user!._id);
    const name = nameFieldRef!.current!.value
    updateDoc(userDocRef, { name }).then(() => {
      dispatch(changeUserValue({ key: "name", value: name }));
      showToast(`Update name success`, "success");
      setIsNameEditing(false);
    })
  }

  function refreshPublicList() {
    if (!user?.isWatchlistPublic) return;
    onPublicSwitchChange(null, false).then(() => {
      onPublicSwitchChange(null, true).then(() => {
        showToast(`Watchlist update success`, "success");
      })
    })
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
            {
              isNameEditing ? (
                <form onSubmit={onNameFieldSubmit}>
                  <TextField size="small" inputProps={{ ref: nameFieldRef }} defaultValue={user.name} />
                </form>
              ) : (
                <Stack gap={0}>
                  <Typography variant="body1" fontWeight={700}>{user.name}</Typography>
                  <Typography variant="caption">{user.email}</Typography>
                </Stack>
              )
            }
            <Stack alignSelf="start">
              <IconButton size="small" sx={{ width: 16, height: 16 }} onClick={() => {
                setIsNameEditing((prev) => !prev)
              }}>
                <Edit sx={{ width: 16, height: 16 }} />
              </IconButton>
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
              <Stack direction="row" gap={0.5} alignItems="center">
                <Typography variant="body1">
                  Public Watchlist
                </Typography>
                <IconButton size="small" onClick={refreshPublicList} title="Update public watchlist">
                  <Loop fontSize="small" />
                </IconButton>
              </Stack>
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
              <Typography fontWeight={700} variant="subtitle2" p={1} borderRadius={1} sx={(theme) => ({ backgroundColor: theme.palette.grey[400], wordBreak: "break-all" })}>
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
                <Typography fontWeight={700}>{user.watchListCount}</Typography>
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