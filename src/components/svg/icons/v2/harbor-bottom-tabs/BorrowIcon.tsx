import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export function BorrowIcon({
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
        fill={color}
        d="M21.76 11.224a2.29 2.29 0 0 0-1.992-.396l-3.922.902A2.623 2.623 0 0 0 13.29 8.5H8.598a2.983 2.983 0 0 0-2.122.878L4.356 11.5h-2.69a1.5 1.5 0 0 0-1.5 1.5v3.75a1.5 1.5 0 0 0 1.5 1.5h9.75a.744.744 0 0 0 .182-.023l6-1.5a.657.657 0 0 0 .111-.037l3.645-1.55.04-.02a2.306 2.306 0 0 0 .37-3.896h-.005ZM1.665 13h2.25v3.75h-2.25V13Zm19.072.77-3.563 1.517-5.853 1.463H5.416v-4.19l2.122-2.12a1.487 1.487 0 0 1 1.06-.44h4.693a1.125 1.125 0 1 1 0 2.25h-2.625a.75.75 0 1 0 0 1.5h3a.782.782 0 0 0 .168-.019l6.281-1.444.03-.008a.806.806 0 0 1 .59 1.49h.003ZM15.54 7c.185 0 .37-.015.553-.045a3.375 3.375 0 1 0 2.646-4.406A3.375 3.375 0 1 0 15.54 7Zm5.625-1.125a1.874 1.874 0 1 1-3.749 0 1.874 1.874 0 0 1 3.749 0ZM15.541 1.75a1.875 1.875 0 0 1 1.805 1.37 3.375 3.375 0 0 0-1.406 2.337 1.875 1.875 0 1 1-.399-3.707Z"
      />
    </Svg>
  );
}
