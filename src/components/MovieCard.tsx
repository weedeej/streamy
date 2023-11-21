import { Movie } from "@/types";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export function MovieCard({movie}: {movie: Movie}) {
  const {title_long, year, description_full, medium_cover_image} = movie;
  return (
    <Card sx={{maxWidth: 350, maxHeight: 500,overflow: "hidden"}}>
      <CardMedia
        sx={{height: 300, objectPosition: "center", objectFit: "contain"}}
        image={medium_cover_image}
      />
      <CardContent>
        <Typography variant="h5">
          {title_long}
        </Typography>
        <Typography variant="body2">
          {description_full}
        </Typography>
      </CardContent>
    </Card>
  )
}