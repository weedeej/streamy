import { MovieQuality, SortList } from "@/enums";
import { ListMoviesParam } from "@/types";

export const defaultQueryParam:ListMoviesParam = {
  query_term: "",
  limit: 20,
  page: 1,
  quality: MovieQuality.ALL,
  minimum_rating: 0,
  // genre TODO
  sort_by: SortList.DATE_ADDED,
  order_by: "desc",
  with_rt_ratings: false
}