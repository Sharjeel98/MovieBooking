import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { dp } from '../../utils/responsive';
import AppText from './AppText';

export type AppButtonVariant = 'filled' | 'outlined';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: AppButtonVariant;
  loading?: boolean;
  color?: string;
  icon?: ReactNode;
  labelColor?: string;
  style?: ViewStyle;
}

export default function AppButton({
  title,
  variant = 'filled',
  loading = false,
  color = colors.primary,
  icon,
  labelColor: labelColorProp,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const isDisabled = !!disabled || loading;
  const filled = variant === 'filled';

  const labelColor =
    labelColorProp ??
    (filled
      ? colors.onPrimary
      : isDisabled
        ? colors.textDisabled
        : color);

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        filled
          ? { backgroundColor: isDisabled ? colors.disabled : color }
          : {
              borderWidth: dp(1),
              borderColor: isDisabled ? colors.disabled : color,
            },
        pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <AppText variant="button" color={labelColor} numberOfLines={1}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: dp(48),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.75 },
});
