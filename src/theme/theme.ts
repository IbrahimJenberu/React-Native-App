// src/theme/theme.ts
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export type ThemeType = 'light' | 'dark';

const palette = {
  // Primary colors
  primaryLight: '#4A6FFF',
  primary: '#3D5CFF',
  primaryDark: '#2D44CC',
  
  // Secondary colors
  secondaryLight: '#FF8A65',
  secondary: '#FF7043',
  secondaryDark: '#E64A19',
  
  // Neutral colors
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#424242',
  black: '#121212',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.white,
    card: palette.white,
    text: palette.black,
    border: palette.lightGray,
    notification: palette.error,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    white: palette.white, // Added missing white property
    // UI elements
    surfaceBackground: palette.white,
    cardBackground: palette.white,
    inputBackground: palette.lightGray,
    disabledBackground: palette.lightGray,
    divider: palette.lightGray,
    // Text
    textPrimary: palette.black,
    textSecondary: palette.darkGray,
    textDisabled: palette.gray,
    textInverse: palette.white,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    pill: 999,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.primary,
    secondary: palette.secondary,
    background: palette.black,
    card: palette.darkGray,
    text: palette.white,
    border: palette.darkGray,
    notification: palette.error,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
    white: palette.white, // Added missing white property
    // UI elements
    surfaceBackground: palette.black,
    cardBackground: palette.darkGray,
    inputBackground: palette.darkGray,
    disabledBackground: palette.darkGray,
    divider: palette.darkGray,
    // Text
    textPrimary: palette.white,
    textSecondary: palette.lightGray,
    textDisabled: palette.gray,
    textInverse: palette.black,
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography,
};

export type Theme = typeof lightTheme;