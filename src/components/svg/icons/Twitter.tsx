import React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function TwitterIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 16,
    height = 16;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Mask
        id="prefix__a"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={16}
        height={17}
      >
        <Path d="M16 .117H0v16h16v-16z" fill="#fff" />
      </Mask>
      <G mask="url(#prefix__a)">
        <Path
          d="M15.354 4.97l-1.869 1.87c-.377 4.376-4.068 7.777-8.485 7.777-.907 0-1.656-.144-2.224-.428-.458-.229-.645-.475-.692-.544a.5.5 0 01.24-.746c.017-.006 1.515-.582 2.467-1.678A6.935 6.935 0 013.424 9.71c-.775-1.15-1.643-3.15-1.375-6.136a.5.5 0 01.853-.308c.022.022 2.08 2.069 4.596 2.733v-.381a2.992 2.992 0 01.898-2.144 2.93 2.93 0 012.11-.856 3.041 3.041 0 012.592 1.5H15a.5.5 0 01.354.854z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
