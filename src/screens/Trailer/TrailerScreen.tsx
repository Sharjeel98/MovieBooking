import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import YoutubePlayer, {
  PLAYER_ERRORS,
  PLAYER_STATES,
  YoutubeIframeRef,
} from 'react-native-youtube-iframe';

import { useGetMovieVideosQuery } from '../../api/movieApi';
import AppText from '../../components/common/AppText';
import type { RootStackScreenProps } from '../../navigation/types';
import { selectTrailer } from '../../services/trailerService';
import { colors, screenPadding, spacing } from '../../theme';
import { lockLandscape, lockPortrait } from '../../utils/orientation';
import { dp } from '../../utils/responsive';

type Props = RootStackScreenProps<'Trailer'>;

const youtubeErrorCopy: Record<PLAYER_ERRORS, string> = {
  [PLAYER_ERRORS.HTML5_ERROR]: 'This trailer cannot be played in the embedded player.',
  [PLAYER_ERRORS.VIDEO_NOT_FOUND]: 'This trailer is no longer available on YouTube.',
  [PLAYER_ERRORS.EMBED_NOT_ALLOWED]:
    'This trailer cannot be played inside the app.',
  [PLAYER_ERRORS.INVALID_PARAMETER]: 'The trailer ID from TMDB is invalid.',
};

const enterPlayerMode = () => {
  StatusBar.setHidden(true, 'fade');
  NavigationBar.setHidden(true);
  lockLandscape();
};

const restoreAppMode = () => {
  StatusBar.setHidden(false, 'fade');
  NavigationBar.setHidden(false);
  NavigationBar.setStyle('light');
  return lockPortrait();
};

export default function TrailerScreen({ route, navigation }: Props) {
  const { movieId } = route.params;
  const { width, height } = useWindowDimensions();
  const closedRef = useRef(false);
  const playerRef = useRef<YoutubeIframeRef | null>(null);
  const [playing, setPlaying] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState<string>();

  const { data, isLoading, isError, refetch } = useGetMovieVideosQuery(movieId);
  const trailer = useMemo(() => selectTrailer(data?.results), [data?.results]);

  useEffect(() => {
    enterPlayerMode();

    return () => {
      void restoreAppMode();
    };
  }, []);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', restoreAppMode);
    const unsubscribeBeforeRemove = navigation.addListener(
      'beforeRemove',
      restoreAppMode,
    );

    return () => {
      unsubscribeBlur();
      unsubscribeBeforeRemove();
    };
  }, [navigation]);

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    setPlaying(false);
    void restoreAppMode().finally(navigation.goBack);
  }, [navigation]);

  const handleStateChange = useCallback(
    (state: PLAYER_STATES) => {
      if (state === PLAYER_STATES.ENDED) {
        close();
        return;
      }

      if (state === PLAYER_STATES.PLAYING) {
        setPlaying(true);
        return;
      }

      if (state === PLAYER_STATES.PAUSED) {
        setPlaying(false);
      }
    },
    [close],
  );

  const handleError = useCallback((error: string) => {
    setPlaying(false);
    setPlayerReady(true);
    setPlayerError(
      youtubeErrorCopy[error as PLAYER_ERRORS] ?? 'This trailer could not be played.',
    );
  }, []);

  const handleReady = useCallback(() => {
    setPlayerReady(true);
    playerRef.current?.seekTo(0, true);
    setPlaying(true);
  }, []);

  const handleFullScreenChange = useCallback((isFullScreen: boolean) => {
    if (isFullScreen) {
      enterPlayerMode();
      return;
    }

    close();
  }, [close]);

  const playerSize = useMemo(() => {
    const heightFirstWidth = Math.round((height * 16) / 9);
    if (heightFirstWidth <= width) {
      return { width: heightFirstWidth, height };
    }

    return {
      width,
      height: Math.round((width * 9) / 16),
    };
  }, [height, width]);

  const playerKey = trailer?.key ? `${trailer.key}-${width}x${height}` : 'trailer';

  const playerHeight = Math.max(playerSize.height, dp(200));
  const playerWidth = Math.max(playerSize.width, dp(200));

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Message
            title="Trailer unavailable"
            message="We could not load this trailer right now."
            actionLabel="Try again"
            onAction={refetch}
          />
        ) : trailer ? (
          <>
            <View style={playerSize}>
              <YoutubePlayer
                ref={playerRef}
                height={playerHeight}
                width={playerWidth}
                key={playerKey}
                videoId={trailer.key}
                play={playing}
                forceAndroidAutoplay={true}
                onReady={handleReady}
                onChangeState={handleStateChange}
                onFullScreenChange={handleFullScreenChange}
                onError={handleError}
                initialPlayerParams={{
                  controls: true,
                  preventFullScreen: true,
                  rel: false,
                  modestbranding: true,
                }}
                webViewStyle={styles.webView}
                webViewProps={{
                  allowsFullscreenVideo: false,
                  mediaPlaybackRequiresUserAction: false,
                  allowsInlineMediaPlayback: true,
                  allowsPictureInPictureMediaPlayback: false,
                  scrollEnabled: false,
                  bounces: false,
                }}
              />
              {!playerReady && (
                <View style={styles.iframeLoaderOverlay}>
                  <ActivityIndicator size="large" color={colors.white} />
                </View>
              )}
            </View>
            {!!playerError && (
              <View style={styles.errorOverlay}>
                <Message title="Trailer cannot play here" message={playerError} />
              </View>
            )}
          </>
        ) : (
          <Message
            title="Trailer unavailable"
            message="TMDB did not return a YouTube trailer for this movie."
          />
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close trailer"
        hitSlop={dp(8)}
        onPress={close}
        style={({ pressed }) => [
          styles.closeButton,
          pressed && styles.pressed,
        ]}
      >
        <AppText variant="button" color={colors.textInverse}>
          Done
        </AppText>
      </Pressable>
    </View>
  );
}

function Loading() {
  return (
    <View style={styles.messageBox}>
      <ActivityIndicator size="large" color={colors.white} />
      <AppText variant="body" color={colors.textDisabled} style={styles.messageText}>
        Loading trailer...
      </AppText>
    </View>
  );
}

interface MessageProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function Message({ title, message, actionLabel, onAction }: MessageProps) {
  return (
    <View style={styles.messageBox}>
      <AppText variant="h3" color={colors.textInverse} style={styles.messageTitle}>
        {title}
      </AppText>
      <AppText variant="body" color={colors.textDisabled} style={styles.messageText}>
        {message}
      </AppText>
      {!!onAction && !!actionLabel && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
        >
          <AppText variant="button" color={colors.textInverse}>
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  pressed: { opacity: 0.7 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 3,
    minWidth: dp(56),
    height: dp(36),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  webView: { backgroundColor: colors.black },
  iframeLoaderOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  messageBox: {
    width: '100%',
    maxWidth: dp(360),
    alignItems: 'center',
    paddingHorizontal: screenPadding,
  },
  messageTitle: { textAlign: 'center' },
  messageText: { marginTop: spacing.sm, textAlign: 'center' },
  retryButton: {
    minWidth: dp(132),
    minHeight: dp(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.textInverse,
    borderRadius: dp(8),
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
});
