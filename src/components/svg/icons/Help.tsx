import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function HelpIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 25,
    height = 25;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M12.557 2.982c5.523 0 10 4.478 10 10s-4.477 10-10 10-10-4.478-10-10 4.477-10 10-10zm0 13.5a1 1 0 100 2 1 1 0 000-2zm0-8.75a2.75 2.75 0 00-2.75 2.75.75.75 0 001.493.102l.007-.102a1.25 1.25 0 012.5 0c0 .54-.135.806-.645 1.333l-.136.137c-.878.878-1.22 1.447-1.22 2.53a.75.75 0 001.5 0c0-.538.136-.805.646-1.332l.135-.137c.878-.878 1.22-1.448 1.22-2.53a2.75 2.75 0 00-2.75-2.75z"
        fill={color}
      />
    </Svg>
  );
}
