import { RootState } from "@/state/store";
import { addMovie, removeMovie } from "@/state/watchList/watchListSlice";
import { theme } from "@/styles";
import { Movie } from "@/types";
import { createMagnetLink, showToast } from "@/utils";
import { Add, Download, ExpandMore, Link, Remove } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


type DownloadLink = { url: string, label: string };

export function MovieCard({ movie }: { movie: Movie }) {
  const { title_long, description_full, medium_cover_image, torrents, id } = movie;
  const trackerList = useSelector((state: RootState) => state.trackerList.trackers);
  const user = useSelector((state: RootState) => state.auth.user);
  const watchList = useSelector((state: RootState) => state.watchList.watchList);
  const [onWatchList, setIsOnWatchList] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [torrentsAnchorEl, setTorrentsAnchorEl] = useState<HTMLElement | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<{ magnets: DownloadLink[], torrents: DownloadLink[] } | null>(null)

  useEffect(() => {
    setIsOnWatchList(!!watchList.find((m) => m.id === id))
  }, [watchList]);

  // effect for links
  useEffect(() => {
    if (downloadLinks) return;
    setDownloadLinks((prev) => ({magnets: [], torrents: []}));
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

  function onDownloadsClick(e: React.MouseEvent<HTMLButtonElement>) {
    user ? setTorrentsAnchorEl(e.currentTarget) : showToast("Must be logged-in to download", "error")
  }

  function onMagnetClick(link: DownloadLink) {
    navigator.clipboard.writeText(link.url)
    showToast(`${link.label} magnet link has been copied to your clipboard!`, "success");
    setTorrentsAnchorEl(null);
  }

  function onTorrentClick(link: DownloadLink) {
    showToast(`${link.label} torrent file is going to be downloaded.`, "success");
    window.open(link.url, "_blank");
    setTorrentsAnchorEl(null);
  }

  function addOrRemoveFromWatchList() {
    if (onWatchList) {
      dispatch(removeMovie({id, title: title_long}));
      return;
    }
    dispatch(addMovie(movie));
  }

  return (
    <>
      <Card sx={{ minWidth: 350, maxWidth: 350, maxHeight: 500, minHeight: 500, display: "flex", flexDirection: "column" }}>
        <CardMedia
          sx={{ maxHeight: 250, minHeight: 250, objectPosition: "center", objectFit: "contain" }}
          image={medium_cover_image}
        />
        <CardContent sx={{ overflow: "auto", flexBasis: 0, flexGrow: 1 }}>
          <Typography variant="h5">
            {title_long} - {id}
          </Typography>
          <Typography variant="body2">
            {description_full}
          </Typography>
        </CardContent>
        <CardActions sx={{ backgroundColor: theme.palette.grey[100], display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Button variant="contained" onClick={onDownloadsClick} endIcon={<ExpandMore />}>
            Download
          </Button>
          <IconButton onClick={addOrRemoveFromWatchList}>
            {onWatchList ? <Remove/> : <Add/>}
          </IconButton>
        </CardActions>
      </Card>
      <Menu open={!!torrentsAnchorEl} onClose={() => setTorrentsAnchorEl(null)} anchorEl={torrentsAnchorEl}>
        <MenuList variant="menu">
          {
            !!downloadLinks && [
              ...downloadLinks.magnets.map((link) => (
                <MenuItem key={`magnet_link_${link.url}`} onClick={() => onMagnetClick(link)}>
                  <ListItemIcon>
                    <Link />
                  </ListItemIcon>
                  <ListItemText>{link.label}</ListItemText>
                </MenuItem>
              )),
              <Divider key={Math.random()}/>,
              ...downloadLinks.torrents.map((link) => (
                <MenuItem key={`torrent_link_${link.url}`} onClick={() => onTorrentClick(link)}>
                  <ListItemIcon>
                    <Download />
                  </ListItemIcon>
                  <ListItemText>{link.label}</ListItemText>
                </MenuItem>
              ))
            ]
          }
        </MenuList>
      </Menu>
    </>
  )
}