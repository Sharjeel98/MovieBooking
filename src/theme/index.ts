import {
  radius as rawRadius,
  screenPadding as rawScreenPadding,
  spacing as rawSpacing,
} from '../constants/spacing';
import { dp } from '../utils/responsive';

export { colors, genreAccents } from './colors';
export { typography } from './typography';
export type { ThemeColor } from './colors';
export type { TypographyVariant } from './typography';

const scale = <T extends Record<string, number>>(tokens: T): T =>
  Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [key, dp(value)]),
  ) as T;

export const spacing = scale(rawSpacing);

export const radius = { ...scale(rawRadius), pill: rawRadius.pill };

export const screenPadding = dp(rawScreenPadding);
