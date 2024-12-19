import { StyleProp, ViewStyle } from 'react-native';
import { cssShadowToNative } from '@utils';
import { COLORS } from './colors';

export const buttonWithShadowStyle = (
  disabled: boolean,
  styles: StyleProp<ViewStyle>
): StyleProp<ViewStyle> => {
  const tStyles = styles as ViewStyle;

  if (disabled) return { ...tStyles, shadowOpacity: 0 };

  return {
    ...tStyles,
    ...cssShadowToNative('0px 0px 12px 0px rgba(53, 104, 221, 0.50)')
  };
};

export const shadow = {
  shadowColor: COLORS.black,
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 1
};

export const shadowThick = {
  shadowColor: COLORS.black,
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.18,
  shadowRadius: 1.0,
  elevation: 4
};
