import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  useGetMovieDetailQuery,
  useGetMovieVideosQuery,
} from '../../api/movieApi';
import AppText from '../../components/common/AppText';
import ErrorView from '../../components/common/ErrorView';
import Loader from '../../components/common/Loader';
import GenreChip from '../../components/movie/GenreChip';
import MovieBanner from '../../components/movie/MovieBanner';
import { Routes } from '../../navigation/routes';
import type { RootStackScreenProps } from '../../navigation/types';
import { selectTrailer } from '../../services/trailerService';
import { colors, screenPadding, spacing } from '../../theme';
import { inTheatersLabel } from '../../utils/date';
import { backdropUrl } from '../../utils/image';
import { lockLandscape, lockPortrait } from '../../utils/orientation';

type Props = RootStackScreenProps<'MovieDetail'>;

export default function MovieDetailScreen({ route, navigation }: Props) {
  const { movieId, title } = route.params;

  const { data, isLoading, isError, refetch } = useGetMovieDetailQuery(movieId);
  const { data: videos, isLoading: videosLoading } =
    useGetMovieVideosQuery(movieId);

  const hasTrailer = !!videos && !!selectTrailer(videos.results);

  useFocusEffect(
    useCallback(() => {
      lockPortrait();
      StatusBar.setStyle('light');

      return () => {
        StatusBar.setStyle('dark');
      };
    }, []),
  );

  const openBooking = useCallback(() => {
    navigation.navigate(Routes.Booking, { movieId, title });
  }, [navigation, movieId, title]);

  const openTrailer = useCallback(() => {
    lockLandscape();
    navigation.navigate(Routes.Trailer, { movieId, title });
  }, [navigation, movieId, title]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Loader />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <ErrorView
          message="We could not load this movie."
          onRetry={refetch}
        />
      </View>
    );
  }

  const path = data.backdrop_path ?? data.poster_path;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MovieBanner
        title={data.title}
        imageUri={backdropUrl(path)}
        releaseLabel={inTheatersLabel(data.release_date)}
        onBack={navigation.goBack}
        onGetTickets={openBooking}
        onWatchTrailer={openTrailer}
        trailerDisabled={!videosLoading && !hasTrailer}
        trailerLoading={videosLoading}
      />

      <View style={styles.sheet}>
        {data.genres.length > 0 && (
          <>
            <AppText variant="h2">Genres</AppText>
            <View style={styles.chips}>
              {data.genres.map((genre, index) => (
                <GenreChip key={genre.id} label={genre.name} index={index} />
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        <AppText variant="h2">Overview</AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.overview}>
          {data.overview || 'No overview available for this title yet.'}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flexGrow: 1 },
  centered: { flex: 1, backgroundColor: colors.background },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.xl,
  },
  overview: { marginTop: spacing.md, marginBottom: spacing.xxxl },
});
