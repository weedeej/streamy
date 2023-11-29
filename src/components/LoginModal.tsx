import { authClient, firestoreClient } from "@/firebaseConfig/firebase";
import { useForm } from "@/hooks";
import { setUser } from "@/state/auth/authSlice";
import { RootState } from "@/state/store";
import { StreamyUser } from "@/types";
import { showToast } from "@/utils";
import { Close, Google, Key } from "@mui/icons-material";
import { Button, CircularProgress, Divider, IconButton, Link, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocFromServer, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

type LoginForm = {
  email: string;
  password: string;
}

export function LoginModal(props: LoginModalProps) {
  const { isOpen, onClose } = props;
  const [loginForm, updateForm, clearForm] = useForm<LoginForm>({ email: "", password: "" });
  const [actionMode, setActionMode] = useState<"Login" | "Register">("Login");
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.auth.user);

  //effect for authstatechange
  useEffect(() => {
    if (!!user) onClose();
  }, [user]);

  function onContinueWithGoogleClick() {
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);
    signInWithRedirect(authClient, provider);
  }

  async function onSubmitClick() {
    setIsSigningIn(true);
    if (actionMode === "Register") {
      createUserWithEmailAndPassword(authClient, loginForm.email, loginForm.password).then(({ user }) => {
        setIsSigningIn(false);
        setActionMode("Login");
      }).catch((r) => {
        if (r.code === "auth/email-already-in-use") {
          setIsSigningIn(false);
          showToast("Email already in use", "error")
          return;
        }
        alert(r)
      })
      return;
    }

    signInWithEmailAndPassword(authClient, loginForm.email, loginForm.password).then(({ user }) => {
      setIsSigningIn(false);
      onClose();
    }).catch((r) => {
      if (r.code === "auth/invalid-login-credentials") {
        setIsSigningIn(false);
        alert("Invalid email or password");
        return;
      }
      alert(r)
    })
  }

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
            <Typography variant="button" fontWeight={700}>{actionMode} to SStreamy</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Stack justifyContent="center" alignItems="center" gap={2} width="100%">
            <Stack direction="column" gap={1}>
              <Button
                startIcon={isSigningIn ? <CircularProgress size={24} /> : <Google />}
                variant="outlined"
                sx={{ borderRadius: 100 }}
                disabled={isSigningIn}
                onClick={onContinueWithGoogleClick}
              >
                Continue with Google
              </Button>
            </Stack>
            <Divider>
              <Typography variant="h6">OR</Typography>
            </Divider>
            <Stack direction="column" gap={2} width="100%">
              <TextField type="email" name="email" size="small" label="Email" value={loginForm.email} onChange={updateForm} />
              <Stack gap={0} width="100%">
                <TextField type="password" name="password" size="small" label="Password" value={loginForm.password} onChange={updateForm} />
                <Stack direction="row" justifyContent="space-between">
                  <Link underline="hover" sx={{ cursor: "pointer" }} component="a" onClick={() => setActionMode("Register")}>
                    <Typography variant="subtitle2" component="span">
                      Create an account
                    </Typography>
                  </Link>
                  <Link underline="hover" sx={{ cursor: "pointer" }} component="a">
                    <Typography variant="subtitle2" component="span">
                      Forgot Password
                    </Typography>
                  </Link>
                </Stack>
              </Stack>
            </Stack>
            <Button startIcon={isSigningIn ? <CircularProgress size={24}/> : <Key fontSize="small"/>} size="large" variant="contained" onClick={onSubmitClick} disabled={isSigningIn}>
              {actionMode}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  )
}