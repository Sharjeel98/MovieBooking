import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { useGetUpcomingMoviesQuery } from '../../api/movieApi';
import AppHeader from '../../components/common/AppHeader';
import EmptyView from '../../components/common/EmptyView';
import ErrorView from '../../components/common/ErrorView';
import Loader from '../../components/common/Loader';
import { SearchIcon } from '../../components/icons';
import MovieCard from '../../components/movie/MovieCard';
import { Routes, WatchRoutes } from '../../navigation/routes';
import type { WatchStackScreenProps } from '../../navigation/types';
import { colors, screenPadding, spacing } from '../../theme';
import { Movie } from '../../types/movie';
import { uniqueById } from '../../utils/helpers';

type Navigation = WatchStackScreenProps<'Home'>['navigation'];

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetUpcomingMoviesQuery({ page });

  const movies = useMemo(() => uniqueById(data?.results ?? []), [data?.results]);
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

  const onRefresh = useCallback(() => {
    if (page === 1) refetch();
    else setPage(1);
  }, [page, refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard movie={item} onPress={openDetail} />
    ),
    [openDetail],
  );

  const header = (
    <AppHeader
      title="Watch"
      right={
        <Pressable
          onPress={() => navigation.navigate(WatchRoutes.Search)}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel="Search movies"
        >
          <SearchIcon />
        </Pressable>
      }
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

  if (isError && movies.length === 0) {
    return (
      <View style={styles.root}>
        {header}
        <ErrorView
          message="We could not load upcoming movies. Check your connection and try again."
          onRetry={refetch}
        />
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
        refreshing={isFetching && page === 1}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.15}
        ListFooterComponent={
          isFetching && page > 1 ? <Loader size="inline" /> : null
        }
        ListEmptyComponent={
          <EmptyView
            title="No upcoming movies"
            message="TMDB has nothing scheduled right now."
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  separator: { height: spacing.xl },
});
