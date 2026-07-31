import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetMovieDetailQuery } from '../../api/movieApi';
import AppButton from '../../components/common/AppButton';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import DateChip from '../../components/seat/DateChip';
import ShowtimeCard from '../../components/seat/ShowtimeCard';
import { SHOWTIMES, buildBookingDays } from '../../mocks/showtimes';
import { Routes } from '../../navigation/routes';
import type { RootStackScreenProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectDay, selectShowtime } from '../../store/bookingSlice';
import { colors, screenPadding, spacing } from '../../theme';
import { BookingDay, Showtime } from '../../types/booking';
import { inTheatersLabel } from '../../utils/date';
import { fontFamily } from '../../constants/typography';
import { dp } from '../../utils/responsive';

type Props = RootStackScreenProps<'Booking'>;

export default function BookingScreen({ route, navigation }: Props) {
  const { movieId, title } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { data } = useGetMovieDetailQuery(movieId);
  const { dayId, showtimeId } = useAppSelector((state) => state.booking);
  const [showtimesReady, setShowtimesReady] = useState(false);

  const days = useMemo(() => buildBookingDays(), []);

  useEffect(() => {
    if (!dayId && days.length) dispatch(selectDay(days[0].id));
  }, [dayId, days, dispatch]);

  useEffect(() => {
    if (dayId && !showtimeId) dispatch(selectShowtime(SHOWTIMES[0].id));
  }, [dayId, showtimeId, dispatch]);

  useEffect(() => {
    const scheduleShowtimes = () => {
      setShowtimesReady(true);
    };

    if (typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(scheduleShowtimes, { timeout: 250 });
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(scheduleShowtimes, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const onSelectDay = useCallback(
    (day: BookingDay) => dispatch(selectDay(day.id)),
    [dispatch],
  );

  const onSelectShowtime = useCallback(
    (showtime: Showtime) => dispatch(selectShowtime(showtime.id)),
    [dispatch],
  );

  const openSeats = useCallback(() => {
    navigation.navigate(Routes.SeatSelection, { movieId, title });
  }, [navigation, movieId, title]);

  return (
    <View style={styles.root}>
      <AppHeader
        centered
        title={data?.title ?? title}
        subtitle={inTheatersLabel(data?.release_date)}
        onBack={navigation.goBack}
      />

      <View style={styles.body}>
        <AppText variant="h2" style={styles.sectionTitle}>
          Date
        </AppText>
        <FlatList
          data={days}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dates}
          style={styles.horizontalList}
          renderItem={({ item }) => (
            <DateChip
              day={item}
              selected={item.id === dayId}
              onPress={onSelectDay}
            />
          )}
        />

        {showtimesReady ? (
          <FlatList
            data={SHOWTIMES}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.showtimes}
            style={styles.horizontalList}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            renderItem={({ item, index }) => (
              <ShowtimeCard
                showtime={item}
                seed={index + 1}
                selected={item.id === showtimeId}
                onPress={onSelectShowtime}
              />
            )}
          />
        ) : (
          <View style={styles.showtimeDeferred}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <AppButton
          title="Select Seats"
          onPress={openSeats}
          disabled={!showtimeId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1, paddingTop: spacing.xxxl },
  sectionTitle: {
    paddingHorizontal: screenPadding,
    fontFamily: fontFamily.medium,
  },
  dates: {
    paddingHorizontal: screenPadding,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  horizontalList: { flexGrow: 0 },
  showtimes: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  showtimeDeferred: {
    height: dp(220),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.md,
  },
});
