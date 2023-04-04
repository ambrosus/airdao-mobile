import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Rect, Svg } from 'react-native-svg';

export function BottomSheetSwiperIcon(props: IconProps) {
  const { scale = 1, color = '#2F2B43' } = props;
  const width = 75,
    height = 7;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Rect
        x="0.96875"
        width="74"
        height="7"
        rx="3.5"
        fill={color}
        fillOpacity="0.2"
      />
    </Svg>
  );
}
