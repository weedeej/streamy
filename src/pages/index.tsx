import { LoginModal, MovieCard, HelpModal, UserDrawer, WatchList } from "@/components";
import { authClient } from "@/firebaseConfig/firebase";
import { useSearch } from "@/hooks";
import { RootState } from "@/state/store";
import { Movie, YTSQueryResponse } from "@/types";
import { AccountCircle, HelpOutline, Login, Menu, Search } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, CircularProgress, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateQuery, search, searchResult] = useSearch();
  const user = useSelector((state: RootState) => state.auth.user);
  const initialMovies = useSelector((state: RootState) => state.homePageMov.movies);

  function onLoginClick() {
    setIsLoginModalOpen(true);
  }

  function onQueryUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    updateQuery("query_term", e.target.value);
    setQuery(() => e.target.value);
  }

  function onHelpModalClick() {
    setIsHelpModalOpen(true);
  }

  function onAccountIconClick() {
    setIsUserDrawerOpen(true);
  }

  return (
    <>
      <UserDrawer isOpen={isUserDrawerOpen} onClose={() => setIsUserDrawerOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <Stack gap={2} minHeight="100vh">
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
              SSTREAMY
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
                    setIsLoading(true);
                    search().then(() => setIsLoading(false))
                  }
                },
                sx: {
                  color: "white"
                }
              }}
              onChange={onQueryUpdate}
              placeholder="Search" />
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" gap={2}>
              <IconButton
                size="large"
                edge="end"
                onClick={onHelpModalClick}
                color="inherit"
                title="Help"
              >
                <HelpOutline />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                onClick={!user ? onLoginClick : onAccountIconClick}
                color="inherit"
                title="User"
              >
                {user ? <AccountCircle /> : <Login />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack p={0}>
          <WatchList />
          <Stack p={4} direction="row" flexWrap="wrap" gap={2} alignItems="stretch" justifyContent="space-evenly" height="100%">
            <MainContent isLoading={isLoading} query={query} result={searchResult} initialMovies={initialMovies} />
          </Stack>
        </Stack>
        <Stack alignItems="center" justifySelf="end" p={4}>
          <Typography variant="h5">
            FOR DMCA
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            I am writing to affirm that all content hosted on this website is made available solely for educational purposes and is sourced from publicly accessible information. As the administrator of the site, I am committed to upholding copyright laws and respecting intellectual property rights.

            In the event that any content on this platform is identified as infringing upon copyright or violating intellectual property rights, I encourage and welcome prompt communication for its removal. Please reach out to me at <i><u>work.deeej@gmail.com</u></i> to address any concerns regarding copyrighted materials. I assure you that swift action will be taken to investigate and, if necessary, remove the contentious content to comply with copyright regulations.

            Thank you for your attention to this matter. I am dedicated to maintaining a platform that adheres to legal standards and encourages the dissemination of knowledge for educational purposes while respecting intellectual property rights.
          </Typography>
        </Stack>
      </Stack>
    </>
  )
}

function MainContent(props: { query: string, result: YTSQueryResponse | null, initialMovies: Movie[] | null, isLoading: boolean }) {
  const { query, result, initialMovies, isLoading } = props;
  console.log(query)
  if (query) {
    if (result !== null) {
      if (result.data.movie_count < 1) {
        return (
          <Typography variant="h4" textAlign="center">
            No results found for: &quot;{query}&quot;
          </Typography>
        )
      } else {
        return result.data.movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      }
    }
  } else {
    if (!initialMovies || isLoading) {
      return (
        <Stack p={8} direction="row" justifyContent="center">
          <CircularProgress />
        </Stack>
      )
    } else {
      return initialMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    }
  }
}