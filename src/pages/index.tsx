import { LoginModal, MovieCard } from "@/components";
import { useSearch } from "@/hooks";
import { RootState } from "@/state/store";
import { setTrackers } from "@/state/trackerList/trackerListSlice";
import { getTrackers } from "@/utils";
import { AccountCircle, Login, Mail, Menu, Notifications, Search } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [updateQuery, search, searchResult] = useSearch();
  const isTrackerListDefault = useSelector((state: RootState) => state.trackerList.default);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTrackerListDefault) return;
    getTrackers().then((trackers) => {
      dispatch(setTrackers(trackers))
    });
  }), [];

  function onLoginClick() {
    setIsLoginModalOpen(true);
  }

  return (
    <>
    <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}/>
      <Stack gap={2}>
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              STREAMY
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              sx={{
                borderColor: "white",
                outlineColor: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "white!important",
                  "&::hover": {
                    borderColor: "white",
                  }
                }
              }}
              InputProps={{
                startAdornment: <Search style={{ stroke: "white", fill: "white" }} />,
                onKeyUp: (e) => {
                  if (e.code === "Enter") {
                    search();
                  }
                },
                sx: {
                  color: "white"
                }
              }}
              onChange={(e) => updateQuery("query_term", e.target.value)}
              placeholder="Search" />
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" gap={2}>
              <IconButton
                size="large"
                edge="end"
                onClick={onLoginClick}
                color="inherit"
              >
                {user ? <AccountCircle /> : <Login />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack p={2} direction="row" flexWrap="wrap" gap={2} alignItems="stretch" justifyContent="space-evenly">
          {
            (searchResult !== null) ? (
              searchResult.data.movie_count < 1 ? "No results found" : (
                searchResult.data.movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
              )
            ) : (
              <>dmca</>
            )
          }
        </Stack>
        {/* <form onSubmit={onSearch}>
        <input onChange={(e) => updateQuery("query_term", e.target.value)}/>
        <input type="submit"/>
      </form> */}
      </Stack>
    </>
  )
}