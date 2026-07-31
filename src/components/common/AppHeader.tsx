import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, screenPadding, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import { BackIcon } from '../icons';
import AppText from './AppText';

export interface AppHeaderProps {
  title?: string;
  backLabel?: string;
  onBack?: () => void;
  subtitle?: string;
  centered?: boolean;
  right?: ReactNode;
  backgroundColor?: string;
  tint?: string;
  showBorder?: boolean;
}

export default function AppHeader({
  title,
  backLabel,
  subtitle,
  centered = false,
  onBack,
  right,
  backgroundColor = colors.surface,
  tint = colors.textPrimary,
  showBorder = true,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const chevron = <BackIcon color={tint} />;

  if (centered) {
    return (
      <View
        style={[
          styles.root,
          !showBorder && styles.noBorder,
          { backgroundColor, paddingTop: insets.top },
        ]}
      >
        <View style={styles.centeredRow}>
          {!!onBack && (
            <Pressable
              onPress={onBack}
              hitSlop={spacing.md}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.floatingBack}
            >
              {chevron}
            </Pressable>
          )}
          <AppText
            variant="screenTitle"
            color={tint}
            numberOfLines={1}
            style={styles.centeredTitle}
          >
            {title}
          </AppText>
          {!!subtitle && (
            <AppText
              variant="subTitle"
              color={colors.textAccent}
              numberOfLines={1}
              style={styles.centeredTitle}
            >
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        !showBorder && styles.noBorder,
        { backgroundColor, paddingTop: insets.top },
      ]}
    >
      <View style={styles.row}>
        {backLabel && onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityLabel={`Back to ${backLabel}`}
            style={({ pressed }) => [
              styles.backGroup,
              pressed && styles.pressed,
            ]}
          >
            {chevron}
            <AppText variant="screenTitle" color={tint} numberOfLines={1}>
              {backLabel}
            </AppText>
          </Pressable>
        ) : (
          <>
            {!!onBack && (
              <Pressable
                onPress={onBack}
                hitSlop={spacing.sm}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={styles.back}
              >
                {chevron}
              </Pressable>
            )}
            {!!title && (
              <AppText
                variant="screenTitle"
                color={tint}
                numberOfLines={1}
                style={styles.title}
              >
                {title}
              </AppText>
            )}
          </>
        )}
        {!!right && <View style={styles.right}>{right}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  noBorder: { borderBottomWidth: 0 },
  row: {
    height: dp(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding,
  },
  back: { marginRight: spacing.sm },
  backGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  centeredRow: {
    minHeight: dp(56),
    justifyContent: 'center',
    paddingHorizontal: dp(56),
    paddingVertical: spacing.sm,
  },
  floatingBack: {
    position: 'absolute',
    left: screenPadding,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  centeredTitle: { textAlign: 'center' },
  title: { flex: 1 },
  right: { marginLeft: spacing.md },
});
