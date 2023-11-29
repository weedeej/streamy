import { defaultQueryParam, ytsConfig } from "@/constants";
import { ListMoviesParam, YTSQueryResponse } from "@/types";
import { showToast } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

export function useSearch(): [(key: keyof typeof query, value: any) => void, () => Promise<void>, YTSQueryResponse | null] {
  const [query, setQuery] = useState<ListMoviesParam>(defaultQueryParam);
  const [searchResult, setSearchResult] = useState<YTSQueryResponse | null>(null);

  function updateQuery(key: keyof typeof query, value: any) {
    setQuery({...query, [key]: value});
  }

  function buildQuery() {
    return Object.entries(query).map(([k,v]) => `${k}=${v}`).join("&");
  }

  async function search() {
    const url = `${ytsConfig.baseUrl}/list_movies.json?${buildQuery()}`
    let response = null;
    try {
      response = (await axios.get<YTSQueryResponse>(url)).data;
    } catch (e:any) {
      showToast(`An error has occured. Contact Developer: ${e.code}`, "error");
      console.error(e);
    }
    setSearchResult(response);
  }

  return [updateQuery, search, searchResult]
}