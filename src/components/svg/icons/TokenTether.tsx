import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function TetherIcon(props: Omit<IconProps, 'color'>) {
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
        d="M16.769 32.02c8.836 0 16-7.163 16-16 0-8.836-7.164-16-16-16-8.837 0-16 7.164-16 16 0 8.837 7.163 16 16 16z"
        fill="#26A17B"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.69 17.404v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.72-.03-1.97-.042v.003c-3.889-.171-6.79-.848-6.79-1.658 0-.81 2.901-1.486 6.79-1.66v2.644c.253.018.981.06 1.987.06 1.207 0 1.813-.05 1.925-.06V14.09c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.774 1.657zm0-3.59v-2.366h5.415V7.84H9.363v3.608h5.415v2.365c-4.4.202-7.71 1.074-7.71 2.118 0 1.044 3.31 1.915 7.71 2.118v7.582h3.912v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.3-1.914-7.694-2.117z"
        fill="#fff"
      />
    </Svg>
  );
}
