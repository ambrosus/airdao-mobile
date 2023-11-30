import React from 'react';
import { G, Mask, Path, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function GanymedeIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = moderateScale(32);
  const height = moderateScale(32);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Mask
        id="prefix__a"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={32}
        height={32}
      >
        <Path d="M32 0H0v32h32V0z" fill="#fff" />
      </Mask>
      <G mask="url(#prefix__a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z"
          fill="#E3ECFF"
        />
        <Path d="M17.333 8H12v2.667h5.333V8z" fill="#4675E0" />
        <Path
          d="M20 8h-5.333v2.667H20V8zM20 8h2.667v2.667H20V8zM20 10.667h2.667v2.666H20v-2.666zM12 8H9.333v2.667H12V8zM12 21.333H9.333V24H12v-2.667zM17.333 21.333h-2.666V24h2.666v-2.667zM20 21.333h-2.667V24H20v-2.667z"
          fill="#4675E0"
        />
        <Path
          d="M14.667 21.333H12V24h2.667v-2.667zM12 10.667H9.333v10.666H12V10.667zM14.667 24h2.666v2.667h-2.666V24zM22.667 16H20v5.333h2.667V16z"
          fill="#4675E0"
        />
        <Path
          d="M22.667 16H20v2.667h2.667V16zM20 16h-5.333v2.667H20V16zM22.667 21.333H20V24h2.667v-2.667zM14.667 5.333h2.666V8h-2.666V5.333z"
          fill="#4675E0"
        />
      </G>
    </Svg>
  );
}
