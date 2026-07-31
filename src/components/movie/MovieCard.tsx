import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Movie } from '../../types/movie';
import { backdropUrl, posterUrl } from '../../utils/image';
import { dp } from '../../utils/responsive';
import AppImage from '../common/AppImage';
import AppText from '../common/AppText';

export interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const path = movie.backdrop_path ?? movie.poster_path;
  const uri = movie.backdrop_path
    ? backdropUrl(movie.backdrop_path)
    : posterUrl(movie.poster_path);

  return (
    <Pressable
      onPress={() => onPress?.(movie)}
      accessibilityRole="button"
      accessibilityLabel={movie.title}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <AppImage
        uri={uri}
        style={styles.image}
        fallbackLabel={movie.title}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.65)']}
        locations={[0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <AppText variant="cardTitle" numberOfLines={2} style={styles.title}>
        {movie.title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: dp(180),
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceDark,
    justifyContent: 'flex-end',
  },
  pressed: { opacity: 0.9 },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  title: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
