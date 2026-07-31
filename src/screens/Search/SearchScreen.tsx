import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetGenresQuery, useSearchMoviesQuery } from '../../api/movieApi';
import AppText from '../../components/common/AppText';
import EmptyView from '../../components/common/EmptyView';
import ErrorView from '../../components/common/ErrorView';
import Loader from '../../components/common/Loader';
import SearchInput from '../../components/common/SearchInput';
import GenreCard from '../../components/movie/GenreCard';
import MovieListItem from '../../components/movie/MovieListItem';
import { SEARCH_DEBOUNCE_MS } from '../../constants/config';
import { useDebounce } from '../../hooks/useDebounce';
import {
  primaryGenreName,
  useGenreArtwork,
  useGenreNames,
} from '../../hooks/useGenres';
import { Routes, WatchRoutes } from '../../navigation/routes';
import type { WatchStackScreenProps } from '../../navigation/types';
import { colors, screenPadding, spacing } from '../../theme';
import { Genre, Movie } from '../../types/movie';
import { uniqueById } from '../../utils/helpers';
import { posterUrl } from '../../utils/image';

type Navigation = WatchStackScreenProps<'Search'>['navigation'];

export default function SearchScreen() {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);
  const isSearching = debouncedQuery.length > 0;

  const genreNames = useGenreNames();
  const { data: genreData, isLoading: genresLoading, isError: genresError, refetch: refetchGenres } =
    useGetGenresQuery();
  const genreArtwork = useGenreArtwork(genreData?.genres);

  const {
    data: results,
    isFetching: resultsFetching,
    isError: resultsError,
    refetch: refetchResults,
  } = useSearchMoviesQuery(
    { query: debouncedQuery },
    { skip: !isSearching },
  );
  const searchedMovies = useMemo(
    () => uniqueById(results?.results ?? []),
    [results?.results],
  );
  const genres = useMemo(
    () => uniqueById(genreData?.genres ?? []),
    [genreData?.genres],
  );

  const openDetail = useCallback(
    (movie: Movie) => {
      navigation.getParent()?.navigate(Routes.MovieDetail, {
        movieId: movie.id,
        title: movie.title,
      });
    },
    [navigation],
  );

  const openResults = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) navigation.navigate(WatchRoutes.SearchResults, { query: trimmed });
  }, [navigation, query]);

  const openGenre = useCallback(
    (genre: Genre) => {
      setQuery(genre.name);
    },
    [],
  );

  const header = (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <SearchInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={openResults}
        returnKeyType="go"
        autoFocus
      />
    </View>
  );

  const renderMovie = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieListItem
        movie={item}
        genreName={primaryGenreName(item.genre_ids, genreNames)}
        onPress={openDetail}
      />
    ),
    [genreNames, openDetail],
  );

  const renderGenre = useCallback(
    ({ item, index }: { item: Genre; index: number }) => {
      const path = genreArtwork[item.id];
      return (
        <GenreCard
          genre={item}
          index={index}
          imageUri={posterUrl(path)}
          onPress={openGenre}
        />
      );
    },
    [genreArtwork, openGenre],
  );

  if (isSearching) {
    const movies = searchedMovies;

    return (
      <View style={styles.root}>
        {header}
        {resultsError ? (
          <ErrorView
            message="Search is unavailable right now."
            onRetry={refetchResults}
          />
        ) : resultsFetching && movies.length === 0 ? (
          <Loader />
        ) : (
          <FlatList
            key="results"
            data={movies}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMovie}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={RowSeparator}
            ListHeaderComponent={
              movies.length > 0 ? (
                <View style={styles.sectionHeader}>
                  <AppText variant="h3">Top Results</AppText>
                  <View style={styles.rule} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <EmptyView
                title="No matches"
                message={`Nothing found for "${debouncedQuery}".`}
              />
            }
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}
      {genresError ? (
        <ErrorView message="We could not load genres." onRetry={refetchGenres} />
      ) : genresLoading ? (
        <Loader />
      ) : (
        <FlatList
          key="genres"
          data={genres}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderGenre}
          numColumns={2}
          keyboardShouldPersistTaps="handled"
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const RowSeparator = () => <View style={styles.rowSeparator} />;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.md,
  },
  gridContent: {
    padding: screenPadding,
    gap: spacing.sm,
    flexGrow: 1,
  },
  column: { gap: spacing.sm },
  listContent: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  sectionHeader: { paddingTop: spacing.lg },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  rowSeparator: { height: spacing.lg },
});
