import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import AppButton from '../common/AppButton';
import AppHeader from '../common/AppHeader';
import AppImage from '../common/AppImage';
import AppText from '../common/AppText';
import { PlayIcon } from '../icons';

export interface MovieBannerProps {
  title: string;
  backLabel?: string;
  imageUri?: string;
  releaseLabel?: string;
  onBack: () => void;
  onGetTickets: () => void;
  onWatchTrailer: () => void;
  trailerDisabled?: boolean;
  trailerLoading?: boolean;
}

export default function MovieBanner({
  title,
  backLabel = 'Watch',
  imageUri,
  releaseLabel,
  onBack,
  onGetTickets,
  onWatchTrailer,
  trailerDisabled = false,
  trailerLoading = false,
}: MovieBannerProps) {
  return (
    <View style={styles.root}>
      <AppImage
        uri={imageUri}
        style={styles.image}
        fallbackLabel={title}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.75)']}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <AppHeader
        backLabel={backLabel}
        onBack={onBack}
        backgroundColor={colors.transparent}
        tint={colors.textInverse}
        showBorder={false}
      />

      <View style={styles.footer}>
        {!!releaseLabel && (
          <AppText
            variant="h3"
            color={colors.textInverse}
            style={styles.release}
          >
            {releaseLabel}
          </AppText>
        )}
        <AppButton
          title="Get Tickets"
          onPress={onGetTickets}
          style={styles.button}
        />
        <AppButton
          title={trailerDisabled ? 'Trailer Unavailable' : 'Watch Trailer'}
          variant="outlined"
          onPress={onWatchTrailer}
          disabled={trailerDisabled}
          loading={trailerLoading}
          labelColor={trailerDisabled ? colors.textDisabled : colors.textInverse}
          icon={
            trailerDisabled || trailerLoading ? undefined : (
              <PlayIcon size={dp(16)} color={colors.textInverse} />
            )
          }
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: dp(560),
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceDark,
  },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  footer: {
    paddingHorizontal: dp(60),
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  release: { textAlign: 'center', marginBottom: spacing.xs },
  button: { borderRadius: radius.md },
});
