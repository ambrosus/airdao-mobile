import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { SVGsModels } from '@models/SVGsModels';
import { COLORS } from '@constants/colors';

export const WatchListIcon = (props: SVGsModels) => {
  const { scale = 1, color = COLORS.neutral500 } = props;
  const width = 20 * scale;
  const height = 21 * scale;
  return (
    <Svg
      width={width}
      height={height}
      fill={color}
      viewBox={`0 0 ${width} ${height}`}
      {...props}
    >
      <Path
        fill="#3568DD"
        d="M.984 10.5C1.768 6.233 5.506 3 10 3c4.493 0 8.232 3.233 9.015 7.5C18.232 14.767 14.493 18 10 18c-4.494 0-8.232-3.233-9.016-7.5ZM10 14.667a4.167 4.167 0 1 0 0-8.334 4.167 4.167 0 0 0 0 8.334ZM10 13a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
      />
    </Svg>
  );
};
