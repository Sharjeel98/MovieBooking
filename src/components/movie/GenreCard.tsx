import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';

import { colors, genreAccents, radius, spacing } from '../../theme';
import { Genre } from '../../types/movie';
import { dp } from '../../utils/responsive';
import AppImage from '../common/AppImage';
import AppText from '../common/AppText';

export interface GenreCardProps {
  genre: Genre;
  imageUri?: string;
  index?: number;
  selected?: boolean;
  onPress?: (genre: Genre) => void;
}

export default function GenreCard({
  genre,
  imageUri,
  index = 0,
  selected = false,
  onPress,
}: GenreCardProps) {
  const accent = genreAccents[index % genreAccents.length];

  return (
    <Pressable
      onPress={() => onPress?.(genre)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={genre.name}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: accent },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {!!imageUri && (
        <AppImage
          uri={imageUri}
          style={styles.image}
        />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <AppText variant="h3" color={colors.textInverse} numberOfLines={2} style={styles.label}>
        {genre.name}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: dp(100),
    borderRadius: radius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  selected: { borderWidth: dp(2), borderColor: colors.primary },
  pressed: { opacity: 0.85 },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  label: { paddingHorizontal: spacing.sm, paddingBottom: spacing.xs },
});
