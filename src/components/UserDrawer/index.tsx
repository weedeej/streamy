import { authClient } from "@/firebaseConfig/firebase";
import { RootState } from "@/state/store";
import { stringAvatar } from "@/utils";
import { Avatar, Button, Card, CardHeader, Drawer, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer(props: UserDrawerProps) {
  const { isOpen, onClose } = props;
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

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