import { RootState } from "@/state/store";
import { stringAvatar } from "@/utils";
import { Avatar, Card, CardHeader, Drawer, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

type UserDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDrawer(props: UserDrawerProps) {
  const { isOpen, onClose } = props;
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return (<>
    <Drawer open={isOpen} anchor="right" onClose={onClose} keepMounted>
      <Paper sx={{ width: 280 }} elevation={0}>
        <Stack padding={1} gap={1}>
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
            borderRadius={2}
            direction="row"
            alignItems="center"
            gap={2}
            sx={(theme) => ({ backgroundColor: theme.palette.grey[300] })}
            p={1}>
              <Typography variant="h5">Watch List</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Drawer>
  </>)
}