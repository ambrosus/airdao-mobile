import { TextStyle as RNTextStyle } from 'react-native';
import { FontSizeKey, FontWeight } from './Text.types';

export const DEFAULT_FONT_SIZE = 16;

export const fontSizeMapping: { [key in FontSizeKey]: number } = {
  subtext: 12,
  subtitle: 24,
  title: 28,
  heading: 32
};

export const fontWeightMapping: {
  [key in FontWeight]: RNTextStyle['fontWeight'];
} = {
  'normal': '400',
  'semi-bold': '600',
  'bold': '700',
  'bolder': '900',
  100: '100',
  200: '200',
  300: '300',
  400: '400',
  500: '500',
  600: '600',
  700: '700',
  800: '800',
  900: '900'
};
