import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'Lato',
  android: 'Lato',
  default: 'System',
});

export const typography = {
  fontFamily,
  fontFamilyBold: `${fontFamily}-Bold`,
  fontFamilySemiBold: `${fontFamily}-SemiBold`,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  lineHeightTight: 1.2,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.6,
} as const;

export type TypographyKey = keyof typeof typography;
