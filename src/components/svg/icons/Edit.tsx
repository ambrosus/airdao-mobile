import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function EditIcon(props: IconProps) {
  const { scale = 1, color = '#000000' } = props;
  const width = 20,
    height = 21;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M18.952 1.048a3.578 3.578 0 00-5.06 0L1.94 13a3.106 3.106 0 00-.825 1.476L.02 19.078a.75.75 0 00.904.903l4.601-1.096a3.106 3.106 0 001.477-.825L18.952 6.11a3.578 3.578 0 000-5.06zm-4 1.06a2.078 2.078 0 112.94 2.94L17 5.939 14.06 3l.892-.891zM13 4.062L15.94 7 5.94 16.998c-.21.21-.474.358-.763.427l-3.416.814.813-3.416c.069-.29.217-.554.427-.764L13 4.06z"
        fill={color}
      />
    </Svg>
  );
}
