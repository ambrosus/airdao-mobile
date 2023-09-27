import React from 'react';
import { ClipPath, Defs, G, Mask, Path, Rect, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function BUSDLogo(props: IconProps) {
  const { scale = 1, color = '#F0B90B' } = props;
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
      <G clip-path="url(#clip0_1395_1061)">
        <Path
          d="M16.5 32.5C25.3366 32.5 32.5 25.3366 32.5 16.5C32.5 7.66344 25.3366 0.5 16.5 0.5C7.66344 0.5 0.5 7.66344 0.5 16.5C0.5 25.3366 7.66344 32.5 16.5 32.5Z"
          fill={color}
        />
        <Mask
          id="mask0_1395_1061"
          // style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="7"
          y="7"
          width="19"
          height="19"
        >
          <Path
            d="M25.8337 7.1665H7.16699V25.8332H25.8337V7.1665Z"
            fill={color2}
          />
        </Mask>
        <G mask="url(#mask0_1395_1061)">
          <Path
            d="M16.4996 7.20605L18.8024 9.55723L13.0039 15.3383L10.7012 13.0425L16.4996 7.20605Z"
            fill={color2}
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.4999 7.1665L18.8415 9.55736L13.004 15.3773L10.6621 13.0425L16.4999 7.1665ZM10.7404 13.0423L13.004 15.2992L18.7635 9.55689L16.4996 7.2454L10.7404 13.0423Z"
            fill={color2}
          />
          <Path
            d="M19.9953 10.6914L22.2981 13.0426L13.0039 22.3089L10.7012 20.0131L19.9953 10.6914Z"
            fill={color2}
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19.9957 10.6514L22.3372 13.0422L13.004 22.3474L10.6621 20.0126L19.9957 10.6514ZM10.7405 20.0125L13.004 22.2693L22.2592 13.0417L19.9953 10.7302L10.7405 20.0125Z"
            fill={color2}
          />
          <Path
            d="M9.5088 14.1763L11.8115 16.5275L9.5088 18.8233L7.20605 16.5275L9.5088 14.1763Z"
            fill={color2}
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.50874 14.1372L11.8505 16.5283L9.50874 18.8629L7.16699 16.5283L9.50874 14.1372ZM7.24501 16.5277L9.50874 18.7848L11.7725 16.5277L9.50874 14.2164L7.24501 16.5277Z"
            fill={color2}
          />
          <Path
            d="M23.4915 14.1763L25.7943 16.5275L16.5001 25.7939L14.1973 23.498L23.4915 14.1763Z"
            fill={color2}
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.4917 14.1372L25.8333 16.528L16.5001 25.8333L14.1582 23.4984L23.4917 14.1372ZM14.2365 23.4983L16.5001 25.7551L25.7553 16.5276L23.4914 14.216L14.2365 23.4983Z"
            fill={color2}
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_1395_1061">
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
