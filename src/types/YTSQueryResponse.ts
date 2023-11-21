import { Movie } from ".";

export interface YTSQueryResponse {
  status:         string;
  status_message: string;
  data:           Data;
  "@meta":        Meta;
}

export interface Meta {
  server_time:     number;
  server_timezone: string;
  api_version:     number;
  execution_time:  string;
}

export interface Data {
  movie_count: number;
  limit:       number;
  page_number: number;
  movies:      Movie[];
}