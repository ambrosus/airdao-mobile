import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function CheckmarkCircleIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 24,
    height = 24;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zm-1.25 9.94l4.47-4.47a.75.75 0 011.133.976l-.073.084-5 5a.75.75 0 01-.976.073l-.084-.073-2.5-2.5a.75.75 0 01.976-1.133l.084.073 1.97 1.97 4.47-4.47-4.47 4.47z"
        fill={color}
      />
    </Svg>
  );
}
