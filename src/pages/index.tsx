import { useSearch } from "@/hooks";
import { Stack } from "@mui/material";
import { useEffect } from "react";

export default function Home() {
  const [updateQuery, search, searchResult] = useSearch();
  
  useEffect(() => {
    if (!searchResult) return;
    console.log(searchResult);
  }, [searchResult]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    search();
  }
  return (
    <Stack>
      <form onSubmit={onSearch}>
        <input onChange={(e) => updateQuery("query_term", e.target.value)}/>
        <input type="submit"/>
      </form>
    </Stack>
  )
}