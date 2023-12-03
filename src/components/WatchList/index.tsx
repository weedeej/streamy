import { RootState } from "@/state/store";
import { Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { WatchListMovieCard } from "./WatchListMovieCard";
import { theme } from "@/styles";
import { useEffect, useMemo, useState } from "react";
import { Movie, PublicWatchlistDoc } from "@/types";
import { collection, doc, getDocFromServer, getDocsFromServer, onSnapshot } from "firebase/firestore";
import { firestoreClient } from "@/firebaseConfig/firebase";
import { useSearchParams } from "next/navigation";

type WatchListProps = {
  isPublicWatchList?: boolean
}
export function WatchList({ isPublicWatchList }: WatchListProps) {
  const urlParams = useSearchParams();
  const publicListId = urlParams.get("list");
  const watchList = useSelector((state: RootState) => state.watchList.watchList)
  const [publicWatchList, setPublicWatchList] = useState<Movie[]>([]);
  const [publicWatchListOwner, setPublicWatchListOwner] = useState<PublicWatchlistDoc | null>(null);

  useEffect(() => {
    if (!isPublicWatchList || !publicListId) return;
    const listOwnerRef = doc(collection(firestoreClient, "publicWatchlist"), publicListId);
    const ownerUnsub = onSnapshot(listOwnerRef, (snap) => {
      if (!snap.exists) return;
      const data = snap.data() as PublicWatchlistDoc;
      setPublicWatchListOwner(() => data);
    });

    const listRef = collection(firestoreClient, `publicWatchlist/${publicListId}/watchList`);
    const listUnsub = onSnapshot((listRef), (snap) => {
      const list = snap.docs.map((d) => d.data() as Movie);
      setPublicWatchList(() => list);
    });

    return () => {
      ownerUnsub();
      listUnsub();
    }
  }, [publicListId]);

  const list = isPublicWatchList ? publicWatchList : watchList;
  if (list.length < 1) return null;

  return (<>
    <Stack direction="column" gap={0}>
      <Stack direction="row" alignItems="start" gap={1} px={2}>
        <Typography variant="h5" fontWeight={500}>{publicWatchListOwner ? `${publicWatchListOwner.ownerName}'s list` : "Your Watch List"}</Typography>
        <Typography variant="subtitle2" fontWeight={700}>({list.length})</Typography>
      </Stack>
      <Stack direction="row" flexWrap="nowrap" sx={{ overflowX: "auto", backgroundColor: theme.palette.grey[700] }} gap={2} p={2}>
        {
          list.map((m) => <WatchListMovieCard key={`watchList_movie_${m.id}`} movie={m} />)
        }
      </Stack>
    </Stack>
  </>)
}