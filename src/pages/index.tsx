import { MovieCard } from "@/components";
import { useSearch } from "@/hooks";
import { RootState } from "@/state/store";
import { setTrackers } from "@/state/trackerList/trackerListSlice";
import { getTrackers } from "@/utils";
import { Search } from "@mui/icons-material";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [updateQuery, search, searchResult] = useSearch();
  const isTrackerListDefault = useSelector((state: RootState) => state.trackerList.default);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTrackerListDefault) return;
    getTrackers().then((trackers) => {
      dispatch(setTrackers(trackers))
    });
  }), [];

  return (
    <Stack gap={2}>
      <Paper>
        <Stack direction="row" p={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h4">
            Streamy
          </Typography>
          <Stack direction="row" gap={2}>
            <TextField
              variant="outlined"
              InputProps={{
                startAdornment: <Search/>,
                onKeyUp: (e) => {
                  if (e.code === "Enter") {
                    search();
                  }
                }
              }}
              onChange={(e) => updateQuery("query_term", e.target.value)}
              placeholder="Search"/>
            <Button variant="contained">Login</Button>
          </Stack>
        </Stack>
      </Paper>
      <Stack p={2} direction="row" flexWrap="wrap" gap={2} alignItems="stretch" justifyContent="space-evenly">
      {
        (searchResult !== null) && (
          searchResult.data.movie_count < 1 ? "No results found" : (
            searchResult.data.movies.map((movie) => <MovieCard key={movie.id} movie={movie}/>)
          )
        )
      }
      </Stack>
      {/* <form onSubmit={onSearch}>
        <input onChange={(e) => updateQuery("query_term", e.target.value)}/>
        <input type="submit"/>
      </form> */}
    </Stack>
  )
}