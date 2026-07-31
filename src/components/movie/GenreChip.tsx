import { StyleSheet, View } from 'react-native';

import { colors, genreAccents, radius, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import AppText from '../common/AppText';

export interface GenreChipProps {
  label: string;
  index?: number;
  color?: string;
}

export default function GenreChip({ label, index = 0, color }: GenreChipProps) {
  const background = color ?? genreAccents[index % genreAccents.length];

  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      <AppText
        variant="label"
        color={colors.textInverse}
        numberOfLines={1}
        style={styles.label}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: dp(30),
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: dp(11) },
});
