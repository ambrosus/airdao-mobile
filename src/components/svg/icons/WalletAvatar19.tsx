import React from 'react';
import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar19(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 128;
  const height = 128;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0_1387_199)">
        <Path fill="#676B73" d="M.387.912H127.08V129.39H.387z" />
        <Path
          d="M53.872 35.294c2.732-9.73 16.524-9.73 19.256 0l16.364 58.29a10 10 0 006.925 6.924l58.289 16.364c9.729 2.732 9.729 16.524 0 19.256l-58.29 16.364a10 10 0 00-6.924 6.925l-16.364 58.289c-2.732 9.729-16.524 9.729-19.256 0l-16.364-58.289a10 10 0 00-6.925-6.925l-58.289-16.364c-9.73-2.732-9.73-16.524 0-19.256l58.29-16.364a10 10 0 006.924-6.925l16.364-58.289z"
          fill="#FF7A00"
          stroke="#191919"
          strokeWidth={5.353}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_199">
          <Path
            fill="#fff"
            transform="translate(.387 .912)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
