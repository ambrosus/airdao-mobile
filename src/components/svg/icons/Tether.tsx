import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function TetherLogo(props: IconProps) {
  const { scale = 1, color = '#50AF95' } = props;
  const width = 33;
  const height = 33;
  const color2 = COLORS.neutral0;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <G clip-path="url(#clip0_1395_6303)">
        <Path
          d="M16.5 32.5C25.3366 32.5 32.5 25.3366 32.5 16.5C32.5 7.66344 25.3366 0.5 16.5 0.5C7.66344 0.5 0.5 7.66344 0.5 16.5C0.5 25.3366 7.66344 32.5 16.5 32.5Z"
          fill={color}
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M18.6699 17.2008C18.5487 17.2094 17.9225 17.2449 16.5254 17.2449C15.4142 17.2449 14.6254 17.2133 14.3486 17.2008C10.0544 17.0213 6.84922 16.3113 6.84922 15.461C6.84922 14.6109 10.0544 13.9018 14.3486 13.7195V16.4936C14.6294 16.5128 15.4334 16.5578 16.5446 16.5578C17.8781 16.5578 18.5457 16.5052 18.6659 16.4945V13.7214C22.951 13.9028 26.1491 14.6128 26.1491 15.461C26.1491 16.3093 22.9519 17.0194 18.6659 17.1998L18.6699 17.2008ZM18.6699 13.4345V10.952H24.6501V7.1665H8.36849V10.952H14.3475V13.4335C9.48773 13.6456 5.83301 14.5601 5.83301 15.6558C5.83301 16.7517 9.48773 17.6653 14.3475 17.8782V25.8332H18.669V17.8754C23.5177 17.6633 27.1663 16.7498 27.1663 15.6549C27.1663 14.5601 23.5207 13.6465 18.669 13.4335L18.6699 13.4345Z"
          fill={color2}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1395_6303">
          <Rect
            width="32"
            height="32"
            fill={color2}
            transform="translate(0.5 0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
