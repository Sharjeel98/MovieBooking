import { Image, ImageProps } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme';
import AppText from './AppText';

export interface AppImageProps
  extends Omit<ImageProps, 'source' | 'placeholder'> {
  uri?: string;
  fallbackLabel?: string;
}

export default function AppImage({
  uri,
  fallbackLabel,
  style,
  ...rest
}: AppImageProps) {
  if (!uri) {
    return (
      <View style={[styles.fallback, style]}>
        {!!fallbackLabel && (
          <AppText
            variant="caption"
            numberOfLines={2}
            style={styles.fallbackText}
          >
            {fallbackLabel}
          </AppText>
        )}
      </View>
    );
  }

  return (
    <Image
      {...rest}
      source={{ uri }}
      style={[styles.base, style]}
      contentFit={rest.contentFit ?? 'cover'}
      cachePolicy={rest.cachePolicy ?? 'memory-disk'}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.border },
  fallback: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallbackText: { textAlign: 'center' },
});
