import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function UndefinedTokenLogo(props: IconProps) {
  const { scale = 1, color = COLORS.gray300 } = props;
  const width = 41;
  const height = 41;
  const color2 = '#A1A6B2';
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Rect
        x="0.556641"
        y="0.660156"
        width="40"
        height="40"
        rx="20"
        fill={color}
        fill-opacity="0.05"
      />
      <G clip-path="url(#clip0_1135_101)">
        <Path
          d="M20.5566 10.6602C26.0796 10.6602 30.5566 15.1382 30.5566 20.6602C30.5566 26.1822 26.0796 30.6602 20.5566 30.6602C15.0336 30.6602 10.5566 26.1822 10.5566 20.6602C10.5566 15.1382 15.0336 10.6602 20.5566 10.6602ZM20.5566 24.1602C20.0044 24.1602 19.5566 24.6079 19.5566 25.1602C19.5566 25.7124 20.0044 26.1602 20.5566 26.1602C21.1089 26.1602 21.5566 25.7124 21.5566 25.1602C21.5566 24.6079 21.1089 24.1602 20.5566 24.1602ZM20.5566 15.4102C19.0379 15.4102 17.8066 16.6414 17.8066 18.1602C17.8066 18.5744 18.1424 18.9102 18.5566 18.9102C18.9363 18.9102 19.2501 18.628 19.2998 18.2619L19.3066 18.1602C19.3066 17.4698 19.8663 16.9102 20.5566 16.9102C21.247 16.9102 21.8066 17.4698 21.8066 18.1602C21.8066 18.699 21.6716 18.9654 21.1617 19.4924L21.0263 19.6298C20.1482 20.5079 19.8066 21.0772 19.8066 22.1602C19.8066 22.5744 20.1424 22.9102 20.5566 22.9102C20.9709 22.9102 21.3066 22.5744 21.3066 22.1602C21.3066 21.6213 21.4416 21.3549 21.9515 20.828L22.087 20.6905C22.9651 19.8124 23.3066 19.2431 23.3066 18.1602C23.3066 16.6414 22.0754 15.4102 20.5566 15.4102Z"
          fill={color2}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1135_101">
          <Rect
            width="20"
            height="20"
            fill="white"
            transform="translate(10.5566 10.6602)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
