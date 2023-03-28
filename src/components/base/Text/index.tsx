import React from 'react';
import { Text as RNText, TextStyle as RNTextStyle } from 'react-native';
import {
  DEFAULT_FONT_SIZE,
  fontSizeMapping,
  fontWeightMapping
} from './Text.constants';
import { FontSizeKey, TextProps } from './Text.types';

export function Text(props: TextProps): JSX.Element {
  const {
    color = '#000000',
    fontSize,
    fontWeight = 'normal',
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

  const styles = {
    color,
    fontSize: getFontSize(),
    fontWeight: getFontWeight()
  };

  return <RNText style={styles} {...restProps} />;
}
