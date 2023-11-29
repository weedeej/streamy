import { Download, Link, OpenInNew } from "@mui/icons-material";
import { Button, Divider, List, ListItem, Modal, Paper, Stack, Typography } from "@mui/material";
import { MagnetIcon } from ".";

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
        height: 500,
        maxHeight: 500,
        overflowY: "auto",
        p: 4,
      }}>
        <Stack gap={2}>
          <Stack gap={2}>
            <Stack gap={1}>
              <Stack direction="column" gap={0.5}>
                <Typography variant="h5">
                  Torrenting Softwares
                </Typography>
                <Stack direction="row" gap={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    Linux/Windows/Mac:
                  </Typography>
                  <Button size="small" variant="outlined" endIcon={<OpenInNew />} target="_blank" href="https://www.qbittorrent.org/download">
                    qBittorent
                  </Button>
                </Stack>
                <Stack direction="row" gap={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    Android:
                  </Typography>
                  <Button size="small" variant="outlined" endIcon={<OpenInNew />} target="_blank" href="https://play.google.com/store/apps/details?id=org.proninyaroslav.libretorrent">
                    LibreTorrent
                  </Button>
                </Stack>
              </Stack>
              <Stack direction="row" gap={2} alignItems="center">
                <Typography variant="h5">
                  For Magnet Links
                </Typography>
                (<MagnetIcon width={20} height={20}/>)
              </Stack>
              <List>
                <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1"> - Click the Link icon from the download button</Typography>
                  <Typography variant="body1"> - Paste the copied link to your torrenting app</Typography>
                </ListItem>
              </List>
            </Stack>
            <Divider />
            <Stack gap={1}>
              <Stack direction="row" gap={2} alignItems="center">
                <Typography variant="h5">
                  For Torrent Files
                </Typography>
                (<Download />)
              </Stack>
              <List>
                <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1"> - Click the Download icon from the download button</Typography>
                  <Typography variant="body1"> - Simply open the downloaded file if torrenting app is <b>ALREADY</b> installed</Typography>
                  <Typography variant="body1"> - Open the downloaded file on your torrenting app if torrenting app is installed <b>AFTER</b> downloading</Typography>
                </ListItem>
              </List>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  )
}