import { theme } from "@/styles";
import { Movie } from "@/types";
import { Delete, Download, MoreVert, Remove } from "@mui/icons-material";
import { Box, Card, CardActions, CardHeader, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import { MagnetIcon } from "..";

export function WatchListMovieCard({ movie }: { movie: Movie }) {
  const { title, description_full, medium_cover_image } = movie;
  return (<>
    <Card sx={{ maxWidth: 400, minWidth: 400, minHeight: 150, display: "flex", gap: 1, maxHeight: 150 }}>
      <Box display="flex">
        <CardMedia image={medium_cover_image} component="img"
          sx={{ width: 150 }} />
        <CardActions sx={{ backgroundColor: theme.palette.grey[100] }}>
          <Stack gap={0} justifyContent="space-between" height="100%">
            <IconButton>
              <MagnetIcon width={20} height={20}/>
            </IconButton>
            <IconButton>
              <Download fontSize="small"/>
            </IconButton>
            <IconButton color="error">
              <Delete fontSize="small" />
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
  </>)
}