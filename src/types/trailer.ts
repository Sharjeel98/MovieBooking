
export type VideoSite = 'YouTube' | 'Vimeo' | string;

export type VideoType =
  | 'Trailer'
  | 'Teaser'
  | 'Clip'
  | 'Featurette'
  | 'Behind the Scenes'
  | 'Bloopers';

export interface Video {
  id: string;
  key: string;
  name: string;
  site: VideoSite;
  size: number;
  type: VideoType;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}
