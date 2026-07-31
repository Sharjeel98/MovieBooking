import { Text, TextProps } from 'react-native';

import { TypographyVariant, typography } from '../../theme';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export default function AppText({
  variant = 'body',
  color,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[typography[variant], color ? { color } : null, style]}
    />
  );
}
