import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { Movie } from '../../types/movie';
import { posterUrl } from '../../utils/image';
import { dp } from '../../utils/responsive';
import AppImage from '../common/AppImage';
import AppText from '../common/AppText';
import { MoreDotsIcon } from '../icons';

export interface MovieListItemProps {
  movie: Movie;
  genreName?: string;
  onPress?: (movie: Movie) => void;
  onPressMore?: (movie: Movie) => void;
}

export default function MovieListItem({
  movie,
  genreName,
  onPress,
  onPressMore,
}: MovieListItemProps) {
  const path = movie.backdrop_path ?? movie.poster_path;

  return (
    <Pressable
      onPress={() => onPress?.(movie)}
      accessibilityRole="button"
      accessibilityLabel={movie.title}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <AppImage
        uri={posterUrl(path)}
        style={styles.thumb}
        fallbackLabel={movie.title}
      />
      <View style={styles.text}>
        <AppText variant="h3" numberOfLines={2}>
          {movie.title}
        </AppText>
        {!!genreName && (
          <AppText variant="caption" style={styles.genre}>
            {genreName}
          </AppText>
        )}
      </View>
      <Pressable
        onPress={() => onPressMore?.(movie)}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={`More options for ${movie.title}`}
      >
        <MoreDotsIcon size={dp(20)} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pressed: { opacity: 0.7 },
  thumb: {
    width: dp(126),
    height: dp(96),
    borderRadius: radius.md,
  },
  text: { flex: 1 },
  genre: { marginTop: spacing.xxs },
});
