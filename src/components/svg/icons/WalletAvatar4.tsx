import React from 'react';
import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar4(props: Omit<IconProps, 'color'>) {
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
      <G clipPath="url(#prefix__clip0_1387_93)">
        <Path fill="#457EFF" d="M.08 0h126.694v128.478H.08z" />
        <Path
          d="M31.801-66.218c13.824-23.318 47.574-23.318 61.398 0l34.448 58.106 33.097 58.885c13.282 23.631-3.593 52.859-30.699 53.172l-67.545.78-67.545-.78c-27.106-.313-43.98-29.541-30.699-53.172L-2.647-8.113l34.448-58.105z"
          fill="#E6E6E6"
          stroke="#191919"
          strokeWidth={5.353}
        />
        <Path
          d="M53.372-75.706c2.732-9.73 16.524-9.73 19.256 0l12.966 46.187a10 10 0 006.925 6.925l46.187 12.966c9.729 2.732 9.729 16.524 0 19.256L92.519 22.594a10 10 0 00-6.925 6.925L72.628 75.706c-2.732 9.73-16.524 9.73-19.256 0L40.406 29.519a10 10 0 00-6.925-6.925L-12.706 9.628c-9.73-2.732-9.73-16.524 0-19.256l46.187-12.966a10 10 0 006.925-6.925l12.966-46.187z"
          fill="#457EFF"
          stroke="#191919"
          strokeWidth={5.353}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_93">
          <Path
            fill="#fff"
            transform="translate(.08)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
