import { Video, VideoType } from '../types/trailer';

const TYPE_PRIORITY: VideoType[] = ['Trailer', 'Teaser', 'Clip'];

export const selectTrailer = (videos: Video[] | undefined): Video | undefined => {
  if (!videos?.length) return undefined;

  const youtube = videos.filter((video) => video.site === 'YouTube');

  for (const type of TYPE_PRIORITY) {
    const matches = youtube.filter((video) => video.type === type);
    if (!matches.length) continue;
    return matches.find((video) => video.official) ?? matches[0];
  }

  return undefined;
};

export const youtubeUrl = (key: string) =>
  `https://www.youtube.com/watch?v=${key}`;
