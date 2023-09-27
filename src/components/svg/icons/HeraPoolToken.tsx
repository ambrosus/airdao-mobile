import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { ClipPath, Defs, G, Mask, Path, Rect, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function HeraPoolTokenLogo(props: IconProps) {
  const { scale = 1, color = COLORS.neutral0 } = props;
  const width = 33;
  const height = 33;
  const color2 = COLORS.brand600;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <G clip-path="url(#clip0_1395_127)">
        <Mask
          id="mask0_1395_127"
          // style="mask-type:luminance"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="33"
          height="33"
        >
          <Path d="M32.5 0.5H0.5V32.5H32.5V0.5Z" fill={color} />
        </Mask>
        <G mask="url(#mask0_1395_127)">
          <Path
            d="M16.5 32.5C25.3667 32.5 32.5 25.3667 32.5 16.5C32.5 7.63328 25.3667 0.5 16.5 0.5C7.63328 0.5 0.5 7.63328 0.5 16.5C0.5 25.3667 7.63328 32.5 16.5 32.5Z"
            fill={color2}
          />
          <Path d="M12.5 13.8335H8.5V19.1668H12.5V13.8335Z" fill={color} />
          <Path
            d="M8.5 19.1665H12.5V24.4998H11.1667C9.69391 24.4998 8.5 23.306 8.5 21.8332V19.1665Z"
            fill={color}
          />
          <Path
            d="M8.5 8.5H9.83333C11.3061 8.5 12.5 9.69391 12.5 11.1667V13.8333H8.5V8.5Z"
            fill={color}
          />
          <Path
            d="M23.167 24.5002H24.5003C25.2367 24.5002 25.8337 23.9032 25.8337 23.1668V21.8335H23.167V24.5002Z"
            fill={color}
          />
          <Path
            d="M17.833 8.5H19.1663C20.6391 8.5 21.833 9.69391 21.833 11.1667V13.8333H17.833V8.5Z"
            fill={color}
          />
          <Path
            d="M17.8333 15.1665H12.5V17.8332H17.8333V15.1665Z"
            fill={color}
          />
          <Path
            d="M17.833 19.1665H21.833V24.4998H20.4997C19.0269 24.4998 17.833 23.306 17.833 21.8332V19.1665Z"
            fill={color}
          />
          <Path
            d="M21.833 13.8335H17.833V19.1668H21.833V13.8335Z"
            fill={color}
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_1395_127">
          <Rect
            width="32"
            height="32"
            fill={color}
            transform="translate(0.5 0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
