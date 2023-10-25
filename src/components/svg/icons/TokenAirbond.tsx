import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function AirBondIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = moderateScale(32);
  const height = moderateScale(32);
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M15.299 29.098c7.345 0 13.299-5.954 13.299-13.3 0-7.344-5.954-13.298-13.3-13.298C7.955 2.5 2 8.454 2 15.799s5.954 13.299 13.299 13.299z"
        fill="#732C17"
        stroke="#1D1D1D"
        strokeWidth={0.65}
      />
      <Path
        d="M16.975 29.087c7.342 0 13.293-5.951 13.293-13.293S24.317 2.5 16.975 2.5 3.68 8.452 3.68 15.794c0 7.342 5.952 13.293 13.294 13.293z"
        fill="#FF5E0D"
        stroke="#1D1D1D"
        strokeWidth={0.65}
      />
      <Path
        d="M11.374 23.689a.457.457 0 00-.1.62l.298.434c.137.2.407.258.614.133l13.193-7.983a1.336 1.336 0 000-2.29L12.186 6.62a.458.458 0 00-.614.133l-.297.435a.457.457 0 00.099.619c.963.748 1.752 1.59 2.373 2.49 2.308 3.347 2.308 7.555 0 10.903-.62.9-1.41 1.741-2.373 2.489z"
        fill="#fff"
      />
      <Path
        d="M12.186 24.876a.458.458 0 01-.614-.133l-.297-.435a.457.457 0 01.099-.62 11.235 11.235 0 002.373-2.488c2.308-3.348 2.308-7.556 0-10.904-.62-.9-1.41-1.741-2.373-2.489a.457.457 0 01-.1-.62m.912 17.689l-.102-.17m.102.17l13.193-7.983a1.336 1.336 0 000-2.29L12.186 6.62a.458.458 0 00-.614.133m0 0l.163.111m-.163-.111l-.297.435m0 0l.163.111"
        stroke="#1D1D1D"
        strokeWidth={0.65}
      />
    </Svg>
  );
}
