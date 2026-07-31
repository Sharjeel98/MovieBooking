import { ImageSize, TMDB, imageSize } from '../constants/config';

export const buildImageUrl = (
  path: string | null | undefined,
  size: ImageSize = imageSize.poster,
): string | undefined =>
  path ? `${TMDB.imageBaseUrl}/${size}${path}` : undefined;

export const posterUrl = (path: string | null | undefined) =>
  buildImageUrl(path, imageSize.poster);

export const backdropUrl = (path: string | null | undefined) =>
  buildImageUrl(path, imageSize.backdrop);
