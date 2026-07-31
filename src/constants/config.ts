
export const TMDB = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  readAccessToken: process.env.EXPO_PUBLIC_TMDB_READ_ACCESS_TOKEN ?? '',
  apiKey: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '',
} as const;

export const imageSize = {
  tiny: 'w92',
  poster: 'w342',
  posterLarge: 'w500',
  backdrop: 'w780',
  backdropLarge: 'w1280',
  original: 'original',
} as const;

export type ImageSize = (typeof imageSize)[keyof typeof imageSize];

export const SEARCH_DEBOUNCE_MS = 400;
