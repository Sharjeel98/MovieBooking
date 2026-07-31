import { DateRange, PaginatedResponse } from './api';

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetail extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  homepage: string | null;
  budget: number;
  revenue: number;
  imdb_id: string | null;
}

export interface UpcomingMoviesResponse extends PaginatedResponse<Movie> {
  dates: DateRange;
}

export type SearchMoviesResponse = PaginatedResponse<Movie>;

export interface GenreListResponse {
  genres: Genre[];
}
