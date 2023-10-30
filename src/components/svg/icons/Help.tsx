import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

export function HelpIcon(props: IconProps) {
  const { color = COLORS.neutral900, scale = 1 } = props;
  const width = moderateScale(20),
    height = moderateScale(20);

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M10 2a8 8 0 110 16 8 8 0 010-16zm0 11.5a.75.75 0 100 1.5.75.75 0 000-1.5zm0-8A2.5 2.5 0 007.5 8a.5.5 0 001 0 1.5 1.5 0 112.632.984l-.106.11-.118.1-.247.185a3.11 3.11 0 00-.356.323C9.793 10.248 9.5 10.988 9.5 12a.5.5 0 001 0c0-.758.196-1.254.535-1.614l.075-.076.08-.073.088-.072.219-.163.154-.125A2.5 2.5 0 0010 5.5z"
        fill={color}
      />
    </Svg>
  );
}
