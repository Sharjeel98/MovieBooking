import { useMemo } from 'react';

import { useGetGenreArtworkQuery, useGetGenresQuery } from '../api/movieApi';
import { Genre } from '../types/movie';

export function useGenreNames() {
  const { data } = useGetGenresQuery();

  return useMemo(() => {
    const map: Record<number, string> = {};
    data?.genres.forEach((genre) => {
      map[genre.id] = genre.name;
    });
    return map;
  }, [data]);
}

export function useGenreArtwork(genres: Genre[] | undefined) {
  const { data } = useGetGenreArtworkQuery(genres ?? [], {
    skip: !genres?.length,
  });

  return data ?? {};
}

export function primaryGenreName(
  genreIds: number[] | undefined,
  names: Record<number, string>,
): string | undefined {
  const id = genreIds?.find((genreId) => names[genreId]);
  return id ? names[id] : undefined;
}
