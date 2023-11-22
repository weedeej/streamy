import { RootState } from "@/state/store";
import { CircularProgress, Modal, Stack } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal(props: LoginModalProps) {
  const {isOpen, onClose} = props;
  const [actionMode, setActionMode] = useState<"login" | "register">("login");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Stack direction="column" justifyContent="center" alignItems="center" gap={2}>
        <CircularProgress/>
      </Stack>
    </Modal>
  )
}