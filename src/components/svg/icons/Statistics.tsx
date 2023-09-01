import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import Svg, { Path } from 'react-native-svg';

export function StatisticsLogo(props: IconProps) {
  const { scale = 1, color = '#393B40' } = props;
  const width = 24;
  const height = 25;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill={color}
    >
      <Path
        d="M5.74908 3.0105C6.99122 3.0105 7.99817 4.01745 7.99817 5.25958V18.7614C7.99817 20.0035 6.99122 21.0105 5.74908 21.0105C4.50695 21.0105 3.5 20.0035 3.5 18.7614V5.25958C3.5 4.01745 4.50695 3.0105 5.74908 3.0105ZM12.2491 7.0105C13.4912 7.0105 14.4982 8.01745 14.4982 9.25958V18.7614C14.4982 20.0035 13.4912 21.0105 12.2491 21.0105C11.0069 21.0105 10 20.0035 10 18.7614V9.25958C10 8.01745 11.0069 7.0105 12.2491 7.0105ZM18.7491 11.0105C19.9912 11.0105 20.9982 12.0174 20.9982 13.2596V18.7614C20.9982 20.0035 19.9912 21.0105 18.7491 21.0105C17.5069 21.0105 16.5 20.0035 16.5 18.7614V13.2596C16.5 12.0174 17.5069 11.0105 18.7491 11.0105Z"
        fill={color}
      />
    </Svg>
  );
}
