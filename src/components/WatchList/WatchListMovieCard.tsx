import { theme } from "@/styles";
import { Movie } from "@/types";
import { Delete, Download, MoreVert, Remove } from "@mui/icons-material";
import { Box, Card, CardActions, CardHeader, CardMedia, CircularProgress, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import { MagnetIcon } from "..";
import { useEffect, useState } from "react";
import { createMagnetLink, showToast } from "@/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { firestoreClient } from "@/firebaseConfig/firebase";
import { deleteDoc, doc } from "firebase/firestore";


type DownloadLink = { url: string, label: string };

export function WatchListMovieCard({ movie }: { movie: Movie }) {
  const { title, title_long, description_full, medium_cover_image, torrents, id } = movie;
  const trackerList = useSelector((state: RootState) => state.trackerList.trackers);
  const user = useSelector((state: RootState) => state.auth.user);
  const [downloadLinks, setDownloadLinks] = useState<{ magnets: DownloadLink[], torrents: DownloadLink[] } | null>(null);
  const [torrentsAnchorEl, setTorrentsAnchorEl] = useState<HTMLElement | null>(null);
  const [magnetsAnchorEl, setMagnetsAnchorEl] = useState<HTMLElement | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // effect for links
  useEffect(() => {
    if (downloadLinks) return;
    setDownloadLinks((prev) => ({ magnets: [], torrents: [] }));
    torrents.forEach((torrent) => {
      const { hash, type, quality, size, url: torrentFile } = torrent;
      const magnet = createMagnetLink(hash, title_long, trackerList);
      const label = `${type.charAt(0).toUpperCase() + type.slice(1)} ${quality} ${size}`;
      setDownloadLinks((prev) => ({
        magnets: [...prev?.magnets ?? [], { url: magnet, label }],
        torrents: [...prev?.torrents ?? [], { url: torrentFile, label }]
      }));
    });
  }, []);

  function onTorrentClick(e: React.MouseEvent<HTMLButtonElement>) {
    setMagnetsAnchorEl(null);
    setTorrentsAnchorEl(e.currentTarget);
  }

  function onMagnetClick(e: React.MouseEvent<HTMLButtonElement>) {
    setTorrentsAnchorEl(null);
    setMagnetsAnchorEl(e.currentTarget);
  }

  function onMagnetLinkClick(link: DownloadLink) {
    navigator.clipboard.writeText(link.url)
    showToast(`${link.label} magnet link has been copied to your clipboard!`, "success");
    setMagnetsAnchorEl(null);
  }

  function onTorrentLinkClick(link: DownloadLink) {
    showToast(`${link.label} torrent file is going to be downloaded.`, "success");
    window.open(link.url, "_blank");
    setTorrentsAnchorEl(null);
  }

  function onDownloadsClose() {
    setTorrentsAnchorEl(null);
    setMagnetsAnchorEl(null);
  }

  function removeFromWatchList() {
    if (!user) return;
    const docRef = doc(firestoreClient, `/users/${user._id}/watchList/${id}`);
    setIsDeleteLoading(true);
    deleteDoc(docRef).then(() => {
      showToast(`${title_long} has been removed from watch list`, "error");
      setIsDeleteLoading(false);
    });
  }

  return (<>
    <Card sx={{ maxWidth: 400, minWidth: 400, minHeight: 150, display: "flex", gap: 1, maxHeight: 150 }}>
      <Box display="flex">
        <CardMedia image={medium_cover_image} component="img"
          sx={{ width: 150 }} />
        <CardActions sx={{ backgroundColor: theme.palette.grey[100] }}>
          <Stack gap={0} justifyContent="space-between" height="100%">
            <IconButton onClick={onMagnetClick}>
              <MagnetIcon width={20} height={20} />
            </IconButton>
            <IconButton onClick={onTorrentClick}>
              <Download fontSize="small" />
            </IconButton>
            <IconButton color="error" onClick={removeFromWatchList} disabled={isDeleteLoading}>
              {isDeleteLoading ? <CircularProgress size={24}/> : <Delete fontSize="small" />}
            </IconButton>
          </Stack>
        </CardActions>
      </Box>
      <Box display="flex" p={1}>
        <Stack gap={0} sx={{ overflowY: "auto" }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography variant="subtitle2">{description_full}</Typography>
        </Stack>
      </Box>
    </Card>
    <Menu open={!!torrentsAnchorEl || !!magnetsAnchorEl} onClose={onDownloadsClose} anchorEl={torrentsAnchorEl || magnetsAnchorEl}>
      <MenuList variant="menu">
        {
          (!!downloadLinks) && (
            !!magnetsAnchorEl ? (
              downloadLinks.magnets.map((link) => (
                <MenuItem key={`magnet_link_${link.url}`} onClick={() => onMagnetLinkClick(link)}>
                  <ListItemIcon>
                    <MagnetIcon width={20} height={20} />
                  </ListItemIcon>
                  <ListItemText>{link.label}</ListItemText>
                </MenuItem>
              ))
            ) : (
              downloadLinks.torrents.map((link) => (
                <MenuItem key={`torrent_link_${link.url}`} onClick={() => onTorrentLinkClick(link)}>
                  <ListItemIcon>
                    <Download width={20} height={20} />
                  </ListItemIcon>
                  <ListItemText>{link.label}</ListItemText>
                </MenuItem>
              ))
            )
          )
        }
      </MenuList>
    </Menu>
  </>)
}