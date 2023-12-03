import { LoginModal, MovieCard, HelpModal, UserDrawer, WatchList, FilterPopup } from "@/components";
import { useSearch } from "@/hooks";
import { RootState } from "@/state/store";
import { Movie, YTSQueryResponse } from "@/types";
import { AccountCircle, Close, FilterAltOutlined, HelpOutline, Login, Menu, Search } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, IconButton, Pagination, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [staticQuery, setStaticQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateQuery, search, searchResult, clearResult, filters] = useSearch();
  const user = useSelector((state: RootState) => state.auth.user);
  const initialMovies = useSelector((state: RootState) => state.homePageMov.movies);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPopoverAnchor, setFilterPopoverAnchor] = useState<Element | null>(null);

  // Pagination effect
  useEffect(() => {
    if (!searchResult) return;
    search().then(() => {
      setIsLoading(() => false);
    });
  }, [currentPage]);

  function onQueryClose() {

  }

  function onLoginClick() {
    setIsLoginModalOpen(true);
  }

  function onQueryTermUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) clearResult();
    updateQuery("query_term", e.target.value);
    updateQuery("page", 1);
    setQuery(() => e.target.value);
  }

  function onHelpModalClick() {
    setIsHelpModalOpen(true);
  }

  function onAccountIconClick() {
    setIsUserDrawerOpen(true);
  }

  function onFilterClick(e: React.MouseEvent) {
    setFilterPopoverAnchor(e.currentTarget);
  }

  function clearSearch() {
    clearResult();
    updateQuery("query_term", "");
    updateQuery("page", 1);
    setCurrentPage(1);
    setQuery("");
    setStaticQuery("");
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query === staticQuery) return;
    setIsLoading(true);
    search().then(() => {
      setIsLoading(false);
      setStaticQuery(query)
    })
  }

  function onPageChange(e: any, page: number) {
    setIsLoading(() => true);
    updateQuery("page", page);
    setCurrentPage(() => page);
  }

  const pageCount = (searchResult?.data.movie_count ?? 0) / (searchResult?.data.limit ?? 0);

  return (
    <>
      <UserDrawer isOpen={isUserDrawerOpen} onClose={() => setIsUserDrawerOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <FilterPopup anchorEl={filterPopoverAnchor} onFilterChange={updateQuery} currentFilters={filters} onClose={() => setFilterPopoverAnchor(null)} />
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
            <form onSubmit={onSearch}>
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
                value={query}
                InputProps={{
                  startAdornment: <Search style={{ stroke: "white", fill: "white" }} />,
                  endAdornment: query ? (
                    <IconButton onClick={clearSearch}>
                      <Close fontSize="small" />
                    </IconButton>
                  ) : <></>,
                  sx: {
                    color: "white"
                  }
                }}
                onChange={onQueryTermUpdate}
                placeholder="Search" />
            </form>
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
          <WatchList isPublicWatchList />
          {
            ((searchResult?.data.movie_count ?? 0 > 0)) ? (<Stack alignItems="center" flexWrap="wrap" px={4} pt={2} direction="row" justifyContent="space-between">
              <Typography variant="body2">Showing {searchResult!.data.movies.length} out of {searchResult!.data.movie_count}</Typography>

              <Stack direction="row" gap={1}>
                <IconButton size="small" onClick={onFilterClick}>
                  <FilterAltOutlined/>
                </IconButton>
                {
                  pageCount > 1 && <Pagination
                    count={Math.ceil(pageCount)}
                    color="primary"
                    onChange={onPageChange}
                  />
                }
              </Stack>
            </Stack>) : <></>
          }
          <Stack p={4} direction="row" flexWrap="wrap" gap={2} alignItems="stretch" justifyContent="space-evenly" height="100%">
            <MainContent isLoading={isLoading} query={query} result={searchResult} initialMovies={initialMovies} staticQuery={staticQuery} />
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

function MainContent(props: { query: string, result: YTSQueryResponse | null, initialMovies: Movie[] | null, isLoading: boolean, staticQuery: string }) {
  const { query, result, initialMovies, isLoading, staticQuery } = props;
  const urlParams = useSearchParams();
  const isServer = typeof window === "undefined"

  if (isLoading || !initialMovies || isServer) return (
    <Stack p={8} direction="row" justifyContent="center">
      <CircularProgress />
    </Stack>
  );

  if (query) {
    if (result !== null) {
      if (result.data.movie_count < 1) {
        return (
          <Typography variant="h4" textAlign="center">
            No results found for: &quot;{staticQuery}&quot;
          </Typography>
        )
      } else {
        return result.data.movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      }
    } else {
      return initialMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
    }
  } else {
    return initialMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />);
  }
}