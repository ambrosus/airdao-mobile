import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function EthereumLogo(props: IconProps) {
  const { scale = 1, color = '#328332' } = props;
  const width = 33;
  const height = 33;
  const color2 = COLORS.white;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M16.0637 32.0206C24.9002 32.0206 32.0637 24.8572 32.0637 16.0206C32.0637 7.18407 24.9002 0.0206299 16.0637 0.0206299C7.22713 0.0206299 0.0636902 7.18407 0.0636902 16.0206C0.0636902 24.8572 7.22713 32.0206 16.0637 32.0206Z"
        fill={color}
      />
      <Path
        d="M16.0527 16.5736L9.33169 15.9966L16.0517 12.1946V16.5736H16.0527ZM16.0527 21.0336V27.9736C13.7157 24.3356 11.1397 20.3316 9.06369 17.0906C11.5137 18.4706 14.0717 19.9126 16.0527 21.0336ZM16.0527 10.9656L9.06369 14.8656L16.0527 4.02063V10.9656Z"
        fill={color2}
      />
      <Path
        d="M22.7737 15.9966L16.0527 16.5736V12.1946L22.7737 15.9966ZM16.0527 21.0346C18.0327 19.9146 20.5897 18.4706 23.0407 17.0906C20.9647 20.3326 18.3887 24.3366 16.0527 27.9726V21.0346ZM16.0527 10.9656V4.02063L23.0407 14.8656L16.0527 10.9656Z"
        fill={color2}
        fill-opacity="0.601"
      />
      <Path
        opacity="0.2"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.0527 16.5736L22.7727 15.9966L16.0527 19.7716V16.5736Z"
        fill={color2}
      />
      <Path
        opacity="0.603"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.0517 16.5736L9.33069 15.9966L16.0517 19.7716V16.5736Z"
        fill={color2}
      />
    </Svg>
  );
}
