import { TextStyle } from 'react-native';

import { fontFamily, fontSize } from '../constants/typography';
import { dp } from '../utils/responsive';
import { colors } from './colors';

export const typography = {
  h1: {
    fontFamily: fontFamily.semiBold,
    fontSize: dp(fontSize.display),
    color: colors.textPrimary,
  },
  screenTitle: {
    fontFamily: fontFamily.medium,
    fontSize: dp(18),
    color: colors.textPrimary,
  },
  subTitle: {
    fontFamily: fontFamily.medium,
    fontSize: dp(13),
    color: colors.textPrimary,
  },
  cardTitle: {
    fontFamily: fontFamily.medium,
    fontSize: dp(fontSize.xxl),
    color: colors.textInverse,
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: dp(fontSize.xxl),
    color: colors.textPrimary,
  },
  h3: {
    fontFamily: fontFamily.medium,
    fontSize: dp(fontSize.lg),
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: dp(fontSize.sm),
    color: colors.textPrimary,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: dp(fontSize.xs),
    color: colors.textSecondary,
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: dp(fontSize.md),
    color: colors.onPrimary,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: dp(fontSize.xs),
    color: colors.textPrimary,
  },
  tab: {
    fontFamily: fontFamily.regular,
    fontSize: dp(10),
    color: colors.tabInactive,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
