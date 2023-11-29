import { RootState } from "@/state/store";
import { Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { WatchListMovieCard } from "./WatchListMovieCard";
import { theme } from "@/styles";

export function WatchList() {
  const watchList = useSelector((state: RootState) => state.watchList.watchList)
  if (watchList.length < 1) return null;
  return (<>
    <Stack direction="column" gap={0}>
      <Stack direction="row" alignItems="start" gap={1} px={2}>
        <Typography variant="h5" fontWeight={500}>Watch List</Typography>
        <Typography variant="subtitle2" fontWeight={700}>({watchList.length})</Typography>
      </Stack>
      <Stack direction="row" flexWrap="nowrap" sx={{overflowX: "auto", backgroundColor: theme.palette.grey[700]}} gap={2} p={2}>
        {
          watchList.map((m) => <WatchListMovieCard key={`watchList_movie_${m.id}`} movie={m}/>)
        }
      </Stack>
    </Stack>
  </>)
}