import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function EditIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 13,
    height = 12;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M9.23321 0.560599C9.98077 -0.18689 11.1927 -0.186863 11.9403 0.56066C12.6878 1.30823 12.6878 2.52029 11.9402 3.26783L11.2065 4.0015L8.49935 1.29439L9.23321 0.560599ZM7.79221 2.00147L1.83829 7.95484C1.65725 8.13586 1.52085 8.35655 1.43989 8.59943L0.525672 11.3421C0.465783 11.5218 0.512544 11.7198 0.64646 11.8538C0.780376 11.9877 0.97846 12.0344 1.15813 11.9746L3.90087 11.0603C4.14368 10.9794 4.36432 10.843 4.54531 10.662L10.4993 4.70857L7.79221 2.00147Z"
        fill={color}
      />
    </Svg>
  );
}
