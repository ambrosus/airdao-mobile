import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function CloseIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 17,
    height = 16;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M3.897 4.054l.073-.084a.75.75 0 01.976-.073l.084.073L10 8.939l4.97-4.97a.75.75 0 01.976-.072l.084.073a.75.75 0 01.073.976l-.073.084L11.061 10l4.97 4.97a.75.75 0 01.072.976l-.073.084a.75.75 0 01-.976.073l-.084-.073L10 11.061l-4.97 4.97a.75.75 0 01-.976.072l-.084-.073a.75.75 0 01-.073-.976l.073-.084L8.939 10l-4.97-4.97a.75.75 0 01-.072-.976l.073-.084-.073.084z"
        fill={color}
      />
    </Svg>
  );
}
