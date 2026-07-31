import { Pressable, StyleSheet } from 'react-native';

import { palette } from '../../constants/colors';
import { colors, radius, spacing } from '../../theme';
import { BookingDay } from '../../types/booking';
import { dp } from '../../utils/responsive';
import AppText from '../common/AppText';
import { fontFamily } from '../../constants/typography';

export interface DateChipProps {
  day: BookingDay;
  selected?: boolean;
  onPress?: (day: BookingDay) => void;
}

export default function DateChip({
  day,
  selected = false,
  onPress,
}: DateChipProps) {
  return (
    <Pressable
      onPress={() => onPress?.(day)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={day.label}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.unselected,
        pressed && !selected ? styles.pressed : null,
      ]}
    >
      <AppText
        variant="label"
        color={selected ? colors.onPrimary : colors.textPrimary}
        numberOfLines={1}
        style={styles.dateText}
      >
        {day.label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: dp(40),
    minWidth: dp(72),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dateText: {
    fontFamily: fontFamily.semiBold,
    fontSize: dp(11)
  },
  selected: {
    backgroundColor: colors.primary,
    shadowColor: palette.blue,
    shadowOpacity: 0.5,
    shadowRadius: dp(8),
    shadowOffset: { width: 0, height: dp(2) },
    elevation: 4,
  },
  unselected: { backgroundColor: palette.chip },
  pressed: { opacity: 0.7 },
});
