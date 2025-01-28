import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function TokenSTAMBIcon({ scale = 1 }: IconProps) {
  const size = 32 * scale;
  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 32 33">
      <Path
        fill="#C5D4F5"
        d="M8.342 3.333a15.242 15.242 0 1 1 15.242 26.4 15.242 15.242 0 0 1-15.242-26.4"
      ></Path>
      <Path
        fill="#3568DD"
        fillRule="evenodd"
        d="M11.056 24.285a.23.23 0 0 1-.308-.067l-.262-.387a.23.23 0 0 1 .05-.312 10.1 10.1 0 0 0 2.132-2.253c2.078-3.037 2.078-6.858 0-9.895a10.1 10.1 0 0 0-2.132-2.253.23.23 0 0 1-.05-.313l.262-.386c.068-.101.204-.13.308-.067l11.645 7.098c.65.397.65 1.34 0 1.736z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
}
