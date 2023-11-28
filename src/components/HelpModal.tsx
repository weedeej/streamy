import { Link } from "@mui/icons-material";
import { Divider, List, ListItem, Modal, Paper, Stack, Typography } from "@mui/material";

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
}
export function HelpModal(props: HelpModalProps) {
  const { isOpen, onClose } = props;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 300,
        maxWidth: 300,
        p: 4,
      }}>
        <Stack gap={2}>
          <Stack gap={0}>
            <Stack direction="row" gap={2} alignItems="center">
              <Typography variant="h5">
                For Magnet Links
              </Typography>
              <Link />
            </Stack>
            <List>
              <ListItem>
                <Typography variant="body1"> - After clicking the link icon&nbsp;</Typography>(<Link fontSize="small" />)
              </ListItem>
            </List>
          </Stack>
          <Divider />
        </Stack>
      </Paper>
    </Modal>
  )
}