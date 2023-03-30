import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ShareIcon(props: IconProps) {
  const { width = 17, height = 16, color = '#FFFFFF' } = props;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        d="M12.75 7.25a.75.75 0 01.743.648L13.5 8v5.25a2.75 2.75 0 01-2.582 2.745L10.75 16h-7.5a2.75 2.75 0 01-2.745-2.582L.5 13.25V8a.75.75 0 011.493-.102L2 8v5.25c0 .647.492 1.18 1.122 1.243l.128.007h7.5a1.25 1.25 0 001.243-1.122L12 13.25V8a.75.75 0 01.75-.75zM2.227 4.462L6.47.22a.75.75 0 01.976-.073L7.53.22l4.243 4.242a.75.75 0 01-.977 1.134l-.084-.073L7.75 2.56v7.69a.75.75 0 01-.648.743L7 11a.75.75 0 01-.743-.648l-.007-.102V2.56L3.288 5.523a.75.75 0 01-.977.073l-.084-.073a.75.75 0 01-.073-.977l.073-.084L6.47.22 2.227 4.462z"
        fill={color}
      />
    </Svg>
  );
}
