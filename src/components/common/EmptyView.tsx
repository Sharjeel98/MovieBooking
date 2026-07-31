import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { screenPadding, spacing } from '../../theme';
import AppText from './AppText';

export interface EmptyViewProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
}

export default function EmptyView({
  title = 'Nothing here yet',
  message,
  icon,
}: EmptyViewProps) {
  return (
    <View style={styles.root}>
      {!!icon && <View style={styles.icon}>{icon}</View>}
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {!!message && (
        <AppText variant="caption" style={styles.message}>
          {message}
        </AppText>
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
  icon: { marginBottom: spacing.md },
  title: { textAlign: 'center' },
  message: { textAlign: 'center', marginTop: spacing.xs },
});
