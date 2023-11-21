import { MovieQuality, SortList } from "@/enums";
import { IntRange } from "./IntRange";

export type ListMoviesParam = {
  limit?: number;
  page?: number;
  quality?: MovieQuality;
  minimum_rating?: IntRange<0, 9>;
  query_term: string;
  // genre: string; TODO
  sort_by?: SortList;
  order_by?: "asc" | "desc";
  with_rt_ratings?: boolean;
}