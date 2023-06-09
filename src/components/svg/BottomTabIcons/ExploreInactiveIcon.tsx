import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';

export function ExploreInactiveIcon(props: IconProps) {
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
        d="M9.5 0.5C4.52944 0.5 0.5 4.52944 0.5 9.5C0.5 14.4706 4.52944 18.5 9.5 18.5C11.625 18.5 13.578 17.7635 15.1177 16.5319L21.7929 23.2071C22.1834 23.5976 22.8166 23.5976 23.2071 23.2071C23.5976 22.8166 23.5976 22.1834 23.2071 21.7929L16.5319 15.1177C17.7635 13.578 18.5 11.625 18.5 9.5C18.5 4.52944 14.4706 0.5 9.5 0.5ZM2.5 9.5C2.5 5.63401 5.63401 2.5 9.5 2.5C13.366 2.5 16.5 5.63401 16.5 9.5C16.5 13.366 13.366 16.5 9.5 16.5C5.63401 16.5 2.5 13.366 2.5 9.5Z"
        fill={color}
      />
    </Svg>
  );
}
