import { StyleSheet, View } from 'react-native';

import { screenPadding, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import AppButton from './AppButton';
import AppText from './AppText';

export interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorView({
  title = 'Something went wrong',
  message = 'We could not load this right now. Please try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorViewProps) {
  return (
    <View style={styles.root}>
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" style={styles.message}>
        {message}
      </AppText>
      {!!onRetry && (
        <AppButton title={retryLabel} onPress={onRetry} style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenPadding,
  },
  title: { textAlign: 'center' },
  message: { textAlign: 'center', marginTop: spacing.xs },
  button: { marginTop: spacing.lg, minWidth: dp(160) },
});
