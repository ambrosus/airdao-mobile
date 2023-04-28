import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';

export function WalletsInactiveIcon(props: IconProps) {
  const { scale = 1, color = '#676B73' } = props;
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M15.75 13C15.3358 13 15 13.3358 15 13.75C15 14.1642 15.3358 14.5 15.75 14.5H18.25C18.6642 14.5 19 14.1642 19 13.75C19 13.3358 18.6642 13 18.25 13H15.75ZM0 2.75C0 1.23122 1.23122 0 2.75 0H16.25C17.7688 0 19 1.23122 19 2.75V4.00822C20.9544 4.13698 22.4998 5.76302 22.4998 7.75V18.2501C22.4998 20.3211 20.8208 22.0001 18.7498 22.0001H3.75391C1.68284 22.0001 0.00390625 20.3211 0.00390625 18.2501V7.75H0V3H0.0112108C0.00379065 2.91766 0 2.83427 0 2.75ZM18.7498 5.5H1.50391V18.2501C1.50391 19.4927 2.51127 20.5001 3.75391 20.5001H18.7498C19.9924 20.5001 20.9998 19.4927 20.9998 18.2501V7.75C20.9998 6.50736 19.9924 5.5 18.7498 5.5ZM17.5 2.75C17.5 2.05964 16.9404 1.5 16.25 1.5H2.75C2.05964 1.5 1.5 2.05964 1.5 2.75C1.5 3.44036 2.05964 4 2.75 4H17.5V2.75Z"
        fill={color}
      />
    </Svg>
  );
}
