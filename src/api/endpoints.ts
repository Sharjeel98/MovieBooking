export const endpoints = {
  upcomingMovies: '/movie/upcoming',
  popularMovies: '/movie/popular',
  searchMovies: '/search/movie',
  discoverMovies: '/discover/movie',
  genreList: '/genre/movie/list',
  movieDetail: (id: number) => `/movie/${id}`,
  movieVideos: (id: number) => `/movie/${id}/videos`,
} as const;
