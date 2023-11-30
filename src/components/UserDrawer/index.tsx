import { authClient } from "@/firebaseConfig/firebase";
import { RootState } from "@/state/store";
import { showToast, stringAvatar } from "@/utils";
import { CopyAll } from "@mui/icons-material";
import { Avatar, Button, Card, CardHeader, Drawer, IconButton, Paper, Stack, Switch, Typography } from "@mui/material";
import { useSelector } from "react-redux";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer(props: UserDrawerProps) {
  const { isOpen, onClose } = props;
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  const watchListUrl = `https://locahost:3000/list/${user.watchListId}`

  function onWatchListCopy() {
    navigator.clipboard.writeText(watchListUrl);
    showToast("Link Copied!", "success");
  }

  function onSignout() {
    authClient.signOut();
    onClose();
  }
  return (<>
    <Drawer open={isOpen} anchor="right" onClose={onClose} keepMounted>
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
              <Switch checked={user.isWatchlistPublic} />
            </Stack>
            <Stack gap={0}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Watchlist URL:
                </Typography>
                <IconButton size="small" title="Copy Link" onClick={onWatchListCopy}>
                  <CopyAll/>
                </IconButton>
              </Stack>
              <Typography fontWeight={700} variant="subtitle2" p={1} borderRadius={1} sx={(theme) => ({ backgroundColor: theme.palette.grey[400] })}>
                {watchListUrl}
              </Typography>
            </Stack>
          </Stack>
          <Stack justifyContent="end" height="100%">
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