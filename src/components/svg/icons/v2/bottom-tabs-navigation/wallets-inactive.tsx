import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function WalletsInactiveIcon({
  scale = 1,
  color = COLORS.neutral800
}: IconProps) {
  const width = 25;
  const height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      fill="none"
    >
      <Path
        d="M18.7549 6.99976H21.7549C22.3072 6.99976 22.7549 7.44747 22.7549 7.99976V19.9998C22.7549 20.5521 22.3072 20.9998 21.7549 20.9998H3.75488C3.2026 20.9998 2.75488 20.5521 2.75488 19.9998V3.99976C2.75488 3.44747 3.2026 2.99976 3.75488 2.99976H18.7549V6.99976ZM4.75488 8.99976V18.9998H20.7549V8.99976H4.75488ZM4.75488 4.99976V6.99976H16.7549V4.99976H4.75488ZM15.7549 12.9998H18.7549V14.9998H15.7549V12.9998Z"
        fill={color}
      />
    </Svg>
  );
}
