import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetMovieDetailQuery } from '../../api/movieApi';
import AppButton from '../../components/common/AppButton';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import { CloseIcon } from '../../components/icons';
import ScreenCurve from '../../components/seat/ScreenCurve';
import Seat from '../../components/seat/Seat';
import SeatLegend from '../../components/seat/SeatLegend';
import { fontFamily } from '../../constants/typography';
import {
  AISLE_AFTER,
  SEAT_BLOCKS,
  SEATS_PER_ROW,
  SEAT_ROWS,
  buildSeatMap,
  splitSeatRow,
} from '../../mocks/seats';
import { SHOWTIMES } from '../../mocks/showtimes';
import type { RootStackScreenProps } from '../../navigation/types';
import {
  selectSelectedSeats,
  selectTotalPrice,
  toggleSeat,
} from '../../store/bookingSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { colors, radius, screenPadding, spacing } from '../../theme';
import { Seat as SeatModel } from '../../types/booking';
import { formatReleaseDate } from '../../utils/date';
import { dp } from '../../utils/responsive';

type Props = RootStackScreenProps<'SeatSelection'>;

const BASE_SEAT = 14;
const SEAT_GAP = 6;
const AISLE = 18;
const ROW_LABEL_WIDTH = dp(18);

const ZOOM_LEVELS = [1, 1.8, 2.5] as const;
const ZOOM_MIN = ZOOM_LEVELS[0];
const ZOOM_MAX = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];

const UNIT_WIDTH =
  SEATS_PER_ROW * BASE_SEAT +
  (SEATS_PER_ROW - 1 - AISLE_AFTER.length) * SEAT_GAP +
  AISLE_AFTER.length * AISLE;

const UNIT_HEIGHT = SEAT_ROWS * BASE_SEAT + (SEAT_ROWS - 1) * SEAT_GAP;
const SCREEN_WIDTH_MULTIPLIER = 1.12;

const SCREEN_BLOCK_HEIGHT = dp(56);

export default function SeatSelectionScreen({ route, navigation }: Props) {
  const { movieId, title } = route.params;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const mapScrollRef = useRef<ScrollView>(null);
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data } = useGetMovieDetailQuery(movieId);
  const { dayId, showtimeId } = useAppSelector((state) => state.booking);
  const selectedSeats = useAppSelector(selectSelectedSeats);
  const total = useAppSelector(selectTotalPrice);

  const [zoom, setZoom] = useState<number>(ZOOM_MIN);
  const [zooming, setZooming] = useState(false);
  const [area, setArea] = useState({ width: 0, height: 0 });

  const showtime = SHOWTIMES.find((item) => item.id === showtimeId);

  const seatSeed = useMemo(
    () => SHOWTIMES.findIndex((item) => item.id === showtimeId) + 1,
    [showtimeId],
  );
  const rows = useMemo(() => buildSeatMap(seatSeed), [seatSeed]);

  const selectedIds = useMemo(
    () => new Set(selectedSeats.map((seat) => seat.id)),
    [selectedSeats],
  );

  const subtitle = [
    formatReleaseDate(dayId),
    showtime && `${showtime.time} ${showtime.hall.replace('Cinetech + ', '')}`,
  ]
    .filter(Boolean)
    .join('  |  ');

  const onToggleSeat = useCallback(
    (seat: SeatModel) => dispatch(toggleSeat(seat)),
    [dispatch],
  );

  const onProceed = useCallback(() => {
    Alert.alert(
      'Please Confirm',
      `${selectedSeats.length} seat(s) selected for $${total}.`,
    );
  }, [selectedSeats.length, total]);

  useEffect(
    () => () => {
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    },
    [],
  );

  const scheduleZoom = useCallback((getNextZoom: (current: number) => number) => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    setZooming(true);
    zoomTimerRef.current = setTimeout(() => {
      setZoom((current) => {
        const next = getNextZoom(current);
        if (next < current) {
          mapScrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        }
        return next;
      });
      zoomTimerRef.current = setTimeout(() => {
        setZooming(false);
        zoomTimerRef.current = null;
      }, 80);
    }, 0);
  }, []);

  const onZoomIn = useCallback(() => {
    scheduleZoom((current) => {
      const index = ZOOM_LEVELS.findIndex((level) => level > current);
      return index === -1 ? ZOOM_MAX : ZOOM_LEVELS[index];
    });
  }, [scheduleZoom]);

  const onZoomOut = useCallback(() => {
    scheduleZoom((current) => {
      const index = [...ZOOM_LEVELS]
        .reverse()
        .findIndex((level) => level < current);
      return index === -1
        ? ZOOM_MIN
        : ZOOM_LEVELS[ZOOM_LEVELS.length - 1 - index];
    });
  }, [scheduleZoom]);

  const fitScale = useMemo(() => {
    if (!area.width || !area.height) return 0;
    const stageWidth = Math.max(
      UNIT_WIDTH * SCREEN_WIDTH_MULTIPLIER,
      UNIT_WIDTH + ROW_LABEL_WIDTH,
    );
    const usableWidth = area.width - screenPadding * 2;
    const usableHeight =
      area.height - SCREEN_BLOCK_HEIGHT - spacing.xxl - spacing.lg;
    return Math.min(usableWidth / stageWidth, usableHeight / UNIT_HEIGHT);
  }, [area]);

  const scale = fitScale * zoom;
  const seatSize = BASE_SEAT * scale;
  const gap = SEAT_GAP * scale;
  const seatBlockWidth = UNIT_WIDTH * scale;
  const screenWidth = seatBlockWidth * SCREEN_WIDTH_MULTIPLIER;
  const mapStageWidth = Math.max(screenWidth, seatBlockWidth + ROW_LABEL_WIDTH);
  const mapReady = fitScale > 0;

  return (
    <View style={styles.root}>
      <AppHeader
        centered
        title={data?.title ?? title}
        subtitle={subtitle || undefined}
        onBack={navigation.goBack}
      />

      <View
        style={styles.mapArea}
        onLayout={({ nativeEvent }) => {
          const { width, height } = nativeEvent.layout;
          setArea((current) =>
            current.width === width && current.height === height
              ? current
              : { width, height },
          );
        }}
      >
        {mapReady ? (
          <ScrollView
            ref={mapScrollRef}
            horizontal
            scrollEnabled={zoom > ZOOM_MIN}
            showsHorizontalScrollIndicator={zoom > ZOOM_MIN}
            contentContainerStyle={styles.mapContent}
          >
            <View style={[styles.mapStage, { width: mapStageWidth }]}>
              <View style={styles.screen}>
                <ScreenCurve width={screenWidth} height={dp(36)} />
                <AppText variant="caption" style={styles.screenLabel}>
                  SCREEN
                </AppText>
              </View>

              <View style={styles.seatRows}>
                {rows.map((seats, index) => (
                  <View key={index} style={[styles.row, { marginBottom: gap }]}>
                    <AppText
                      variant="caption"
                      color={colors.textPrimary}
                      style={styles.rowLabel}
                    >
                      {index + 1}
                    </AppText>
                    {splitSeatRow(seats).map((block, blockIndex) => (
                      <View
                        key={blockIndex}
                        style={[
                          styles.seatBlock,
                          blockIndex === 0 && styles.leftBlock,
                          blockIndex === SEAT_BLOCKS.length - 1 &&
                          styles.rightBlock,
                          {
                            width:
                              SEAT_BLOCKS[blockIndex] * seatSize +
                              (SEAT_BLOCKS[blockIndex] - 1) * gap,
                            marginRight:
                              blockIndex === SEAT_BLOCKS.length - 1
                                ? 0
                                : AISLE * scale,
                          },
                        ]}
                      >
                        {block.map((seat, seatIndex) => (
                          <View
                            key={seat.id}
                            style={{
                              marginRight:
                                seatIndex === block.length - 1 ? 0 : gap,
                            }}
                          >
                            <Seat
                              seat={seat}
                              size={seatSize}
                              selected={selectedIds.has(seat.id)}
                              onPress={onToggleSeat}
                            />
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.mapLoader}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText variant="caption" color={colors.textSecondary}>
              Preparing seats...
            </AppText>
          </View>
        )}

        {mapReady && (
          <View style={styles.zoomControls}>
            <ZoomButton
              label="+"
              onPress={onZoomIn}
              disabled={zooming || zoom >= ZOOM_MAX}
            />
            <ZoomButton
              label="−"
              onPress={onZoomOut}
              disabled={zooming || zoom <= ZOOM_MIN}
            />
          </View>
        )}
        {zooming && (
          <View style={styles.zoomLoader} pointerEvents="none">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
        <SeatLegend />

        {selectedSeats.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {selectedSeats.map((seat) => (
              <View
                key={seat.id}
                style={styles.chip}
              >
                <AppText variant="label" style={styles.chipText}>
                  {seat.column}
                </AppText>
                <AppText
                  variant="label"
                  color={colors.textSecondary}
                  style={styles.chipText}
                >
                  {' / '}
                  {seat.row} row
                </AppText>
                <Pressable
                  onPress={() => onToggleSeat(seat)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove row ${seat.row} seat ${seat.column}`}
                  hitSlop={spacing.xs}
                  style={({ pressed }) => [
                    styles.chipClose,
                    pressed && styles.chipClosePressed,
                  ]}
                >
                  <CloseIcon size={dp(16)} color={colors.textPrimary} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <View style={styles.totalBox}>
            <AppText variant="caption">Total Price</AppText>
            <AppText variant="label" style={styles.totalValue}>
              $ {total}
            </AppText>
          </View>
          <AppButton
            title="Proceed to pay"
            onPress={onProceed}
            disabled={selectedSeats.length === 0}
            style={styles.payButton}
          />
        </View>
      </View>
    </View>
  );
}

function ZoomButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label === '+' ? 'Zoom in' : 'Zoom out'}
      style={({ pressed }) => [
        styles.zoomButton,
        (pressed || disabled) && styles.zoomButtonMuted,
      ]}
    >
      <AppText variant="label" style={styles.zoomLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  mapArea: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  mapContent: {
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  mapStage: { alignItems: 'center' },
  mapLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  screen: {
    marginBottom: spacing.lg,
  },
  screenLabel: {
    position: 'absolute',
    top: dp(12),
    left: 0,
    right: 0,
    textAlign: 'center',
    letterSpacing: dp(1),
    fontSize: dp(8),
    lineHeight: dp(12),
  },
  seatRows: { alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  seatBlock: { flexDirection: 'row' },
  leftBlock: { justifyContent: 'flex-end' },
  rightBlock: { justifyContent: 'flex-start' },
  rowLabel: {
    width: dp(18),
    fontFamily: fontFamily.semiBold,
    fontSize: dp(8),
    lineHeight: dp(12),
  },
  zoomControls: {
    position: 'absolute',
    right: screenPadding,
    bottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  zoomButton: {
    width: dp(40),
    height: dp(40),
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonMuted: { opacity: 0.5 },
  zoomLoader: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: dp(16),
    lineHeight: dp(20),
  },
  sheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  chips: { gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  chipText: {
    fontSize: dp(12),
    lineHeight: dp(14),
  },
  chipClose: {
    width: dp(30),
    height: dp(30),
    marginRight: -dp(8),
    marginLeft: dp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipClosePressed: { opacity: 0.65 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  totalBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  totalValue: {
    fontFamily: fontFamily.semiBold,
    fontSize: dp(12),
    lineHeight: dp(16),
  },
  payButton: { flex: 1 },
});
