import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useSearchMoviesQuery } from '../../api/movieApi';
import AppHeader from '../../components/common/AppHeader';
import EmptyView from '../../components/common/EmptyView';
import ErrorView from '../../components/common/ErrorView';
import Loader from '../../components/common/Loader';
import MovieListItem from '../../components/movie/MovieListItem';
import { primaryGenreName, useGenreNames } from '../../hooks/useGenres';
import { Routes } from '../../navigation/routes';
import type { WatchStackScreenProps } from '../../navigation/types';
import { colors, screenPadding, spacing } from '../../theme';
import { Movie } from '../../types/movie';
import { uniqueById } from '../../utils/helpers';

type Props = WatchStackScreenProps<'SearchResults'>;

export default function SearchResultsScreen({ route, navigation }: Props) {
  const { query } = route.params;
  const [page, setPage] = useState(1);
  const genreNames = useGenreNames();

  const { data, isLoading, isFetching, isError, refetch } = useSearchMoviesQuery(
    { query, page },
  );

  const movies = useMemo(() => uniqueById(data?.results ?? []), [data?.results]);
  const total = data?.total_results ?? 0;
  const hasMore = !!data && data.page < data.total_pages;

  const openDetail = useCallback(
    (movie: Movie) => {
      navigation.getParent()?.navigate(Routes.MovieDetail, {
        movieId: movie.id,
        title: movie.title,
      });
    },
    [navigation],
  );

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setPage((current) => current + 1);
  }, [isFetching, hasMore]);

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieListItem
        movie={item}
        genreName={primaryGenreName(item.genre_ids, genreNames)}
        onPress={openDetail}
      />
    ),
    [genreNames, openDetail],
  );

  const header = (
    <AppHeader
      title={isLoading ? 'Searching…' : `${total} Results Found`}
      onBack={navigation.goBack}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.root}>
        {header}
        <Loader />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.root}>
        {header}
        <ErrorView message="Search is unavailable right now." onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && page > 1 ? <Loader size="inline" /> : null
        }
        ListEmptyComponent={
          <EmptyView
            title="No matches"
            message={`Nothing found for "${query}".`}
          />
        }
      />
    </View>
  );
}

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  separator: { height: spacing.lg },
});
