import { ActivityIndicator, StyleSheet, View, ViewProps } from 'react-native';

import { colors, spacing } from '../../theme';
import AppText from './AppText';

export interface LoaderProps extends ViewProps {
  size?: 'full' | 'inline';
  label?: string;
}

export default function Loader({
  size = 'full',
  label,
  style,
  ...rest
}: LoaderProps) {
  return (
    <View
      {...rest}
      style={[size === 'full' ? styles.full : styles.inline, style]}
    >
      <ActivityIndicator
        size={size === 'full' ? 'large' : 'small'}
        color={colors.primary}
      />
      {!!label && (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  inline: { paddingVertical: spacing.lg, alignItems: 'center' },
  label: { marginTop: spacing.xs },
});
