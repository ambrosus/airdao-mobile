import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
export const DefaultPermissionsIcon = ({
  scale = 1,
  color = COLORS.neutral600
}: IconProps) => {
  const width = 28 * scale;
  const height = 27 * scale;
  return (
    <Svg width={width} height={height} fill="none">
      <Path
        fill={color}
        d="M14 26.833C6.635 26.833.665 20.863.665 13.5.666 6.136 6.636.167 13.999.167c7.364 0 13.334 5.97 13.334 13.333 0 7.364-5.97 13.333-13.334 13.333Zm-3.054-3.11a23.868 23.868 0 0 1-2.244-8.89H3.415c.528 4.236 3.54 7.7 7.531 8.89Zm.428-8.89c.2 3.252 1.13 6.307 2.625 9.003a21.207 21.207 0 0 0 2.626-9.003h-5.251Zm13.21 0h-5.288a23.869 23.869 0 0 1-2.243 8.89 10.678 10.678 0 0 0 7.53-8.89ZM3.415 12.167h5.287c.174-3.166.96-6.168 2.244-8.89a10.678 10.678 0 0 0-7.53 8.89Zm7.959 0h5.251A21.207 21.207 0 0 0 14 3.164a21.207 21.207 0 0 0-2.625 9.003Zm5.679-8.89a23.869 23.869 0 0 1 2.243 8.89h5.288a10.678 10.678 0 0 0-7.531-8.89Z"
      />
    </Svg>
  );
};
