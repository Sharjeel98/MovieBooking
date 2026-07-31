import {
  GenreListResponse,
  Genre,
  MovieDetail,
  SearchMoviesResponse,
  UpcomingMoviesResponse,
} from '../types/movie';
import { MovieVideosResponse } from '../types/trailer';
import { uniqueById } from '../utils/helpers';
import { baseApi } from './baseApi';
import { endpoints } from './endpoints';

interface PageArg {
  page?: number;
}

interface SearchArg extends PageArg {
  query: string;
}

type ArtworkEntry = readonly [number, string];

const isArtworkEntry = (entry: ArtworkEntry | null): entry is ArtworkEntry =>
  entry !== null;

const appendUniqueMovies = <T extends { id: number }>(
  cache: { results: T[] },
  results: T[],
) => {
  cache.results = uniqueById([...cache.results, ...results]);
};

const GENRE_ARTWORK_PAGES = [1, 2, 3];

export const movieApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingMovies: builder.query<UpcomingMoviesResponse, PageArg | void>({
      query: (arg) => ({
        url: endpoints.upcomingMovies,
        params: { page: arg?.page ?? 1 },
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (cache, incoming) => {
        if (incoming.page === 1) {
          Object.assign(cache, incoming);
          return;
        }
        cache.page = incoming.page;
        appendUniqueMovies(cache, incoming.results);
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: ['Movie'],
    }),

    searchMovies: builder.query<SearchMoviesResponse, SearchArg>({
      query: ({ query, page = 1 }) => ({
        url: endpoints.searchMovies,
        params: { query, page, include_adult: false },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}("${queryArgs.query}")`,
      merge: (cache, incoming) => {
        if (incoming.page === 1) {
          Object.assign(cache, incoming);
          return;
        }
        cache.page = incoming.page;
        appendUniqueMovies(cache, incoming.results);
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: ['Movie'],
    }),

    getGenreArtwork: builder.query<Record<number, string>, Genre[]>({
      async queryFn(genres, _api, _extraOptions, baseQuery) {
        const map: Record<number, string> = {};
        const usedImages = new Set<string>();
        const popularResponses = await Promise.all(
          GENRE_ARTWORK_PAGES.map((page) =>
            baseQuery({
              url: endpoints.popularMovies,
              params: { page },
            }),
          ),
        );

        popularResponses.forEach((response) => {
          if (response.error) return;

          const data = response.data as SearchMoviesResponse;
          uniqueById(data.results).forEach((movie) => {
            const path = movie.backdrop_path ?? movie.poster_path;
            if (!path || usedImages.has(path)) return;

            const genreId = movie.genre_ids.find((id) => !map[id]);
            if (genreId === undefined) return;

            map[genreId] = path;
            usedImages.add(path);
          });
        });

        const missingGenres = genres.filter((genre) => !map[genre.id]);
        const missingEntries = await Promise.all(
          missingGenres.map(async (genre) => {
            const result = await baseQuery({
              url: endpoints.discoverMovies,
              params: {
                with_genres: genre.id,
                sort_by: 'popularity.desc',
                include_adult: false,
                page: 1,
              },
            });

            if (result.error) return null;

            const data = result.data as SearchMoviesResponse;
            const movie =
              data.results.find((item) => {
                const path = item.backdrop_path ?? item.poster_path;
                return path && !usedImages.has(path);
              }) ??
              data.results.find((item) => item.backdrop_path || item.poster_path);
            const path = movie?.backdrop_path ?? movie?.poster_path;

            return path ? ([genre.id, path] as const) : null;
          }),
        );

        missingEntries.filter(isArtworkEntry).forEach(([genreId, path]) => {
          map[genreId] = path;
          usedImages.add(path);
        });

        return { data: map };
      },
      providesTags: ['Genre'],
    }),

    getMovieDetail: builder.query<MovieDetail, number>({
      query: (id) => endpoints.movieDetail(id),
      providesTags: (_result, _error, id) => [{ type: 'Movie', id }],
    }),

    getMovieVideos: builder.query<MovieVideosResponse, number>({
      query: (id) => endpoints.movieVideos(id),
      providesTags: (_result, _error, id) => [{ type: 'Video', id }],
    }),

    getGenres: builder.query<GenreListResponse, void>({
      query: () => endpoints.genreList,
      providesTags: ['Genre'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUpcomingMoviesQuery,
  useGetGenreArtworkQuery,
  useSearchMoviesQuery,
  useGetMovieDetailQuery,
  useGetMovieVideosQuery,
  useGetGenresQuery,
} = movieApi;
