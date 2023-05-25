import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function NotificationIcon(props: IconProps) {
  const { scale = 1, color = '#393B40' } = props;
  const width = 28,
    height = 28;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M13.8838 19.3335C13.6407 21.0298 12.1817 22.3337 10.4182 22.3337C8.65462 22.3337 7.19561 21.0298 6.9525 19.3335H13.8838ZM10.4182 0.331177C15.0279 0.331177 18.7807 4.00017 18.9156 8.57722V8.83242H18.9194L18.9192 12.9442L20.3332 16.5885C20.3714 16.6869 20.3971 16.7895 20.4101 16.8939L20.4198 17.0515C20.4198 17.7142 19.9162 18.2593 19.2707 18.3249L19.1398 18.3315H1.69294C1.53423 18.3315 1.37691 18.302 1.229 18.2444C0.61132 18.0042 0.285848 17.3372 0.458705 16.7119L0.499982 16.5875L1.91615 12.9432L1.91691 8.83242C1.91691 4.13731 5.72305 0.331177 10.4182 0.331177Z"
        fill={color}
      />
    </Svg>
  );
}
