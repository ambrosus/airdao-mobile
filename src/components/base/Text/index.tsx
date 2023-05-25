import React from 'react';
import {
  Platform,
  Text as RNText,
  TextStyle as RNTextStyle,
  TextStyle
} from 'react-native';
import {
  DEFAULT_FONT_SIZE,
  fontSizeMapping,
  fontWeightMapping
} from './Text.constants';
import { FontSizeKey, TextProps } from './Text.types';

export function Text(props: TextProps): JSX.Element {
  const {
    style: propsStyle,
    color = '#000000',
    fontSize,
    opacity = 1,
    fontWeight = 'normal',
    align = 'auto',
    fontFamily = 'Inter_500Medium',
    testID,
    ...restProps
  } = props;

  const getFontSize = (): number => {
    if (fontSize) return fontSize;
    const fontSizeKeys: FontSizeKey[] = Object.keys(restProps || {}).filter(
      (key) => key in FontSizeKey
    ) as FontSizeKey[];
    // return default font size if none of the font size keys are provided
    if (fontSizeKeys.length === 0) return DEFAULT_FONT_SIZE;
    // prioritize last key
    return fontSizeMapping[fontSizeKeys[fontSizeKeys.length - 1]];
  };

  const getFontWeight = (): RNTextStyle['fontWeight'] => {
    return fontWeightMapping[fontWeight];
  };

  const fixMisplacement = () => {
    if (Platform.OS === 'ios') {
      switch (fontFamily) {
        case 'Inter_500Medium':
        case 'Inter_600SemiBold':
        case 'Inter_700Bold':
          break;
        case 'Mersad_600SemiBold': {
          return {
            lineHeight: getFontSize() * 1.4, // a workaround to avoid incorrect placement of Text components when used with custom fonts
            height: getFontSize()
          };
        }
        default:
          break;
      }
    }
  };

  const styles: TextStyle = {
    fontFamily,
    color,
    textAlign: align,
    opacity,
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    ...fixMisplacement()
  };

  return (
    <RNText
      testID={testID}
      style={[styles, propsStyle]}
      {...restProps}
      onPress={props.onPress}
    />
  );
}
