import { StyleSheet, View } from 'react-native';

import SeatIcon from '../../../assets/icons/seatIcon.svg';
import { SEAT_PRICES } from '../../mocks/showtimes';
import { colors, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import AppText from '../common/AppText';
import { fontSize, lineHeight } from '../../constants/typography';

const ICON = dp(14);

const ENTRIES = [
  { key: 'selected', label: 'Selected', color: colors.seatSelected },
  { key: 'unavailable', label: 'Not available', color: colors.seatUnavailable },
  { key: 'vip', label: `VIP (${SEAT_PRICES.vip}$)`, color: colors.seatVip },
  {
    key: 'regular',
    label: `Regular (${SEAT_PRICES.regular} $)`,
    color: colors.seatRegular,
  },
];

export default function SeatLegend() {
  return (
    <View style={styles.root}>
      {ENTRIES.map((entry) => (
        <View key={entry.key} style={styles.entry}>
          <SeatIcon width={ICON} height={ICON} color={entry.color} />
          <AppText
            variant="label"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.customText}
          >
            {entry.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.sm,
  },
  entry: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  customText: {
    fontSize: dp(fontSize.sm),
    lineHeight: dp(lineHeight.sm),
  }
});
