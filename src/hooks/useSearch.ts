import { defaultQueryParam, ytsConfig } from "@/constants";
import { ListMoviesParam, YTSQueryResponse } from "@/types";
import { showToast } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

export function useSearch(cb?: (result: YTSQueryResponse | null) => void): [(key: keyof typeof query, value: any) => void, () => Promise<void>, YTSQueryResponse | null, () => void] {
  const [query, setQuery] = useState<ListMoviesParam>(defaultQueryParam);
  const [searchResult, setSearchResult] = useState<YTSQueryResponse | null>(null);

  function updateQuery(key: keyof typeof query, value: any) {
    setQuery({...query, [key]: value});
  }

  function buildQuery() {
    return Object.entries(query).map(([k,v]) => `${k}=${v}`).join("&");
  }

  function clearResult() {
    setSearchResult(null);
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
    cb?.(response);
  }

  return [updateQuery, search, searchResult, clearResult]
}