
export const fontFamily = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const fontAssets = {
  [fontFamily.regular]: require('../../assets/fonts/Poppins-Regular.ttf'),
  [fontFamily.medium]: require('../../assets/fonts/Poppins-Medium.ttf'),
  [fontFamily.semiBold]: require('../../assets/fonts/Poppins-SemiBold.ttf'),
  [fontFamily.bold]: require('../../assets/fonts/Poppins-Bold.ttf'),
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  display: 24,
} as const;

export const lineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 26,
  xxl: 28,
  display: 32,
} as const;

export type FontFamily = (typeof fontFamily)[keyof typeof fontFamily];
