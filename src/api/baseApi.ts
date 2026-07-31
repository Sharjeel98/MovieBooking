import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TMDB } from '../constants/config';

export const baseApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB.baseUrl,
    prepareHeaders: (headers) => {
      if (TMDB.readAccessToken) {
        headers.set('Authorization', `Bearer ${TMDB.readAccessToken}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Movie', 'Genre', 'Video'],
  keepUnusedDataFor: 3600,
  endpoints: () => ({}),
});
