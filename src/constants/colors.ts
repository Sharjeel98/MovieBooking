export const palette = {
  ink: '#2E2739',
  textInk: '#202C43',
  cloud: '#F6F6FA',
  chip: '#EEEEF2',
  grey: '#827D88',
  blue: '#61C3F2',
  mist: '#DBDBDF',

  teal: '#15D2BC',
  pink: '#E26CA5',
  purple: '#564CA3',
  gold: '#CD9D0F',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type PaletteColor = (typeof palette)[keyof typeof palette];
