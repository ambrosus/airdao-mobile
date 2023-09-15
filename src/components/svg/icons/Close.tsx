import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function CloseIcon(props: IconProps) {
  const { scale = 1, color = COLORS.black } = props;
  const width = 17,
    height = 16;
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M1.00609 0.387101L1.08928 0.292893C1.44976 -0.0675905 2.01699 -0.0953204 2.40929 0.209704L2.50349 0.292893L8.79639 6.585L15.0893 0.292893C15.4798 -0.0976309 16.113 -0.0976309 16.5035 0.292893C16.894 0.683418 16.894 1.31658 16.5035 1.70711L10.2114 8L16.5035 14.2929C16.864 14.6534 16.8917 15.2206 16.5867 15.6129L16.5035 15.7071C16.143 16.0676 15.5758 16.0953 15.1835 15.7903L15.0893 15.7071L8.79639 9.415L2.50349 15.7071C2.11297 16.0976 1.4798 16.0976 1.08928 15.7071C0.698756 15.3166 0.698756 14.6834 1.08928 14.2929L7.38139 8L1.08928 1.70711C0.728796 1.34662 0.701066 0.779392 1.00609 0.387101L1.08928 0.292893L1.00609 0.387101Z"
        fill={color}
      />
    </Svg>
  );
}
