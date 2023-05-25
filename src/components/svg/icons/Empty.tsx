import React from 'react';
import { Rect, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function EmptyListsIcon(props: IconProps) {
  const { scale = 1 } = props;
  const width = 178,
    height = 81;
  const color1 = '#0e0e0e1a',
    color2 = '#0e0e0e0d';
  return (
    <Svg
      width={width}
      height={height}
      style={{ transform: [{ scale }] }}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Rect
        x="0.0146484"
        y="0.780273"
        width="177.501"
        height="79.88"
        rx="6"
        fill={color2}
      />
      <Rect
        x="13.0146"
        y="10.7803"
        width="123.786"
        height="14.97"
        rx="6"
        fill={color1}
      />
      <Rect
        x="145.801"
        y="10.7803"
        width="18.7151"
        height="14.97"
        rx="6"
        fill={color1}
      />
      <Rect
        x="13.0146"
        y="35.7505"
        width="123.786"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
      <Rect
        x="145.801"
        y="35.7505"
        width="18.7151"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
      <Rect
        x="13.0146"
        y="50.7202"
        width="123.786"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
      <Rect
        x="145.801"
        y="50.7202"
        width="18.7151"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
      <Rect
        x="13.0146"
        y="65.6904"
        width="123.786"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
      <Rect
        x="145.801"
        y="65.6904"
        width="18.7151"
        height="4.97"
        rx="2.485"
        fill={color1}
      />
    </Svg>
  );
}
