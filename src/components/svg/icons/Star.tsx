import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function StarIcon(props: IconProps) {
  const { scale = 1, color = '#000000' } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M8.788 1.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25L.41 8.948c-.801-.78-.359-2.142.748-2.303L6.43 5.88l2.358-4.777zm1.21.936L7.74 6.615a1.35 1.35 0 01-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 011.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 01.388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 01-1.016-.738L9.998 2.039z"
        fill={color}
      />
    </Svg>
  );
}
