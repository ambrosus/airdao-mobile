import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function ExploreTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 28;
  const height = 28;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M12.5 24c6.627 0 12-5.373 12-12s-5.373-12-12-12S.5 5.373.5 12s5.373 12 12 12zm-.424-8.702a5 5 0 01-2.874-2.874L7.283 7.43a.5.5 0 01.646-.647l4.995 1.92a5 5 0 012.874 2.873l1.919 4.995a.5.5 0 01-.646.646l-4.995-1.919z"
        fill={color}
      />
    </Svg>
  );
}
