import { palette } from '../constants/colors';

export const colors = {
  background: palette.cloud,
  surface: palette.white,
  surfaceDark: palette.ink,
  overlay: 'rgba(0, 0, 0, 0.35)',

  textPrimary: palette.textInk,
  textSecondary: palette.grey,
  textInverse: palette.white,
  textDisabled: palette.mist,
  textAccent: palette.blue,

  primary: palette.blue,
  onPrimary: palette.white,
  disabled: palette.mist,

  border: palette.mist,
  divider: palette.mist,

  tabBar: palette.ink,
  tabActive: palette.white,
  tabInactive: palette.grey,

  seatSelected: palette.gold,
  seatUnavailable: palette.mist,
  seatVip: palette.purple,
  seatRegular: palette.blue,

  error: palette.pink,

  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,
} as const;

export const genreAccents = [
  palette.teal,
  palette.pink,
  palette.purple,
  palette.gold,
] as const;

export type ThemeColor = (typeof colors)[keyof typeof colors];
