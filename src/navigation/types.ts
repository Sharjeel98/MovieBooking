import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type WatchStackParamList = {
  Home: undefined;
  Search: undefined;
  SearchResults: { query: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Watch: NavigatorScreenParams<WatchStackParamList>;
  MediaLibrary: undefined;
  More: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  MovieDetail: { movieId: number; title: string };
  Booking: { movieId: number; title: string };
  SeatSelection: { movieId: number; title: string };
  Trailer: { movieId: number; title: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type WatchStackScreenProps<T extends keyof WatchStackParamList> =
  NativeStackScreenProps<WatchStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
