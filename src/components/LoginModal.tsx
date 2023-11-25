import { RootState } from "@/state/store";
import { Close, Google } from "@mui/icons-material";
import { Box, Button, CircularProgress, Divider, IconButton, Link, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal(props: LoginModalProps) {
  const { isOpen, onClose } = props;
  const [actionMode, setActionMode] = useState<"Login" | "Register">("Login");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 300,
        p: 4,
      }}>
        <Stack direction="column" justifyContent="space-between" alignItems="center" gap={2}>
          <Stack direction="row" width="100%" justifyContent="space-between" alignItems="center">
            <Typography variant="button" fontWeight={700}>{actionMode} to Streamy</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Stack justifyContent="center" alignItems="center" gap={2} width="100%">
            <Stack direction="column" gap={1}>
              <Button startIcon={<Google />} variant="outlined" sx={{ borderRadius: 100 }}>
                Continue with Google
              </Button>
            </Stack>
            <Divider>
              <Typography variant="h6">OR</Typography>
            </Divider>
            <Stack direction="column" gap={2} width="100%">
              <TextField type="email" name="email" size="small" label="Email"/>
              <Stack gap={0} width="100%">
                <TextField type="password" name="password" size="small" label="Password" />
                <Stack direction="row" justifyContent="space-between">
                  <Link underline="hover" sx={{ cursor: "pointer"}} component="a" onClick={() => setActionMode("Register")}>
                    <Typography variant="subtitle2" component="span">
                      Create an account
                    </Typography>
                  </Link>
                  <Link underline="hover" sx={{ cursor: "pointer"}} component="a">
                    <Typography variant="subtitle2" component="span">
                      Forgot Password
                    </Typography>
                  </Link>
                </Stack>
              </Stack>
            </Stack>
            <Button size="large" variant="contained">
              Login
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  )
}