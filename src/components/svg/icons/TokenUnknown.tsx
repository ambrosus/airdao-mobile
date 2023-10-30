import React from 'react';
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';
import { moderateScale } from '@utils/scaling';
import { IconProps } from './Icon.types';

export function UnknownTokenIcon(props: Omit<IconProps, 'color'>) {
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
      <Rect width={32} height={32} rx={16} fill="#0E0E0E" fillOpacity={0.05} />
      <G clipPath="url(#prefix__clip0_1356_720)">
        <Path
          d="M16 6c5.523 0 10 4.478 10 10s-4.477 10-10 10S6 21.522 6 16 10.477 6 16 6zm0 13.5a1 1 0 100 2 1 1 0 000-2zm0-8.75a2.75 2.75 0 00-2.75 2.75.75.75 0 001.493.102l.007-.102a1.25 1.25 0 112.5 0c0 .539-.135.805-.645 1.332l-.135.138c-.878.878-1.22 1.447-1.22 2.53a.75.75 0 001.5 0c0-.539.135-.805.645-1.332l.135-.138c.878-.878 1.22-1.447 1.22-2.53A2.75 2.75 0 0016 10.75z"
          fill="#A1A6B2"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1356_720">
          <Path fill="#fff" transform="translate(6 6)" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
