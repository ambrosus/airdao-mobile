import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Rect, Svg } from 'react-native-svg';

export function BottomSheetSwiperIcon(props: IconProps) {
  const { width = 75, height = 7 } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 75 7" fill="none">
      <Rect
        x="0.96875"
        width="74"
        height="7"
        rx="3.5"
        fill="#2F2B43"
        fillOpacity="0.2"
      />
    </Svg>
  );
}
