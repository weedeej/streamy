import { ytsConfig } from "@/constants";
import { Movie, YTSQueryResponse } from "@/types";
import axios from "axios";

export const getInitialMovies = new Promise<Movie[]>((resolve, rej) => {
  axios.get<YTSQueryResponse>(`${ytsConfig.baseUrl}/list_movies.json?sort_by=download_count`).then((res) => {
    const data = res.data;
    resolve(data.data.movies)
  }).catch((e) => {
    rej(e);
  });
});