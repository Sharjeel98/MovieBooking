import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '../../constants/colors';
import { fontFamily } from '../../constants/typography';
import { colors, radius, spacing } from '../../theme';
import { Showtime } from '../../types/booking';
import { dp } from '../../utils/responsive';
import AppText from '../common/AppText';
import SeatMapPreview from './SeatMapPreview';

export interface ShowtimeCardProps {
  showtime: Showtime;
  seed?: number;
  selected?: boolean;
  onPress?: (showtime: Showtime) => void;
}

export default function ShowtimeCard({
  showtime,
  seed = 1,
  selected = false,
  onPress,
}: ShowtimeCardProps) {
  return (
    <Pressable
      onPress={() => onPress?.(showtime)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${showtime.time} ${showtime.hall}, from ${showtime.priceFrom} dollars`}
      style={styles.root}
    >
      <View style={styles.heading}>
        <AppText variant="h3">{showtime.time}</AppText>
        <AppText variant="h3" color={colors.textSecondary} numberOfLines={1}>
          {showtime.hall}
        </AppText>
      </View>

      <View style={[styles.card, selected && styles.selected]}>
        <SeatMapPreview seed={seed} />
      </View>


      <AppText color={colors.textSecondary} style={styles.price}>
        From <AppText style={styles.priceValue}>{showtime.priceFrom}$</AppText> or{' '}
        <AppText style={styles.priceValue}>{showtime.bonusFrom} bonus</AppText>
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { width: dp(270) },
  heading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  card: {
    minHeight: dp(156),
    borderRadius: radius.sm,
    borderWidth: dp(1),
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.primary,
    shadowColor: palette.blue,
    shadowOpacity: 0.28,
    shadowRadius: dp(10),
    shadowOffset: { width: 0, height: dp(4) },
    elevation: 4,
  },
  price: { marginTop: spacing.sm, fontFamily: fontFamily.semiBold },
  priceValue: { fontFamily: fontFamily.semiBold },
});
