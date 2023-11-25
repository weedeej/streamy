import { RootState } from "@/state/store";
import { theme } from "@/styles";
import { Movie } from "@/types";
import { createMagnetLink } from "@/utils";
import { Download, ExpandMore, Link } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


type DownloadLink = { url: string, label: string };

export function MovieCard({ movie }: { movie: Movie }) {
  const { title_long, description_full, medium_cover_image, torrents, id } = movie;
  const trackerList = useSelector((state: RootState) => state.trackerList.trackers);
  const [torrentsAnchorEl, setTorrentsAnchorEl] = useState<HTMLElement | null>(null);
  const [downloadLinks, setDownloadLinks] = useState<{ magnets: DownloadLink[], torrents: DownloadLink[] } | null>(null)

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
    setTorrentsAnchorEl(e.currentTarget);
  }

  function onMagnetClick(link: DownloadLink) {
    navigator.clipboard.writeText(link.url)
    alert(`${link.label} magnet link has been copied to your clipboard!`);
    setTorrentsAnchorEl(null);
  }

  function onTorrentClick(link: DownloadLink) {
    alert(`${link.label} torrent file is going to be downloaded.`);
    window.open(link.url, "_blank");
    setTorrentsAnchorEl(null);
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
        <CardActions sx={{ backgroundColor: theme.palette.grey[100] }}>
          <Button variant="contained" onClick={onDownloadsClick} endIcon={<ExpandMore />}>
            Download
          </Button>
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
              <Divider />,
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