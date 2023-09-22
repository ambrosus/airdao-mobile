import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function QuestionMarkIcon(props: IconProps) {
  const { scale = 1, color = '#3568DD' } = props;
  const width = 21;
  const height = 21;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M10 0c5.523 0 10 4.478 10 10s-4.477 10-10 10S0 15.522 0 10 4.477 0 10 0zm0 1.667c-4.595 0-8.333 3.738-8.333 8.333 0 4.595 3.738 8.333 8.333 8.333 4.595 0 8.333-3.738 8.333-8.333 0-4.595-3.738-8.333-8.333-8.333zM10 13.5a1 1 0 110 2 1 1 0 010-2zm0-8.75a2.75 2.75 0 012.75 2.75c0 1.01-.297 1.574-1.051 2.359l-.169.171c-.622.622-.78.886-.78 1.47a.75.75 0 01-1.5 0c0-1.01.298-1.574 1.051-2.359l.169-.171c.622-.622.78-.886.78-1.47a1.25 1.25 0 00-2.494-.128L8.75 7.5a.75.75 0 01-1.5 0A2.75 2.75 0 0110 4.75z"
        fill={color}
      />
    </Svg>
  );
}
