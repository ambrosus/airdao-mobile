import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function EmptyWalletListPlaceholderIcon(props: IconProps) {
  const { scale = 1, color = '#0E0E0E' } = props;
  const width = 178,
    height = 67;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      {...props}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Rect
        width={177.501}
        height={24.97}
        rx={6}
        fill={color}
        fillOpacity={0.05}
      />
      <Rect
        x={13}
        y={10}
        width={123.786}
        height={4.97}
        rx={2.485}
        fill={color}
        fillOpacity={0.1}
      />
      <Rect
        x={145.786}
        y={10}
        width={18.715}
        height={4.97}
        rx={2.485}
        fill={color}
        fillOpacity={0.1}
      />
      <Rect
        y={39.97}
        width={177.501}
        height={26.97}
        rx={6}
        fill={color}
        fillOpacity={0.05}
      />
      <Rect
        x={13}
        y={49.97}
        width={123.786}
        height={4.97}
        rx={2.485}
        fill={color}
        fillOpacity={0.1}
      />
      <Rect
        x={145.786}
        y={49.97}
        width={18.715}
        height={4.97}
        rx={2.485}
        fill={color}
        fillOpacity={0.1}
      />
    </Svg>
  );
}
