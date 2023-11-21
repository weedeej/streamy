import { ytsConfig } from "@/constants";
import axios from "axios";
import { useEffect, useState } from "react";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  function search(query: string) {
    setSearchQuery(query);
  }

  useEffect(() => {
    if (!searchQuery) return;
    const url = `${ytsConfig.baseUrl}/list_movies.json`
  }, [searchQuery]);
}