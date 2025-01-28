import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function ReadingListIcon({
  color = COLORS.neutral400,
  scale = 1
}: IconProps) {
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width * scale} ${height * scale}`}
    >
      <G>
        <Path
          fill={color}
          d="M4.917 7.08a1.17 1.17 0 012.143-.647.875.875 0 101.456-.97A2.92 2.92 0 106.196 10h12.457a.875.875 0 100-1.75H6.141a.888.888 0 00-.055 0 1.17 1.17 0 01-1.169-1.17zm7.289-1.746a.875.875 0 100 1.75h8.75a.875.875 0 000-1.75h-8.75zm-4.664 5.833a.875.875 0 000 1.75h13.417a.875.875 0 000-1.75H7.542zM3.167 14.96c0-.484.392-.875.875-.875h14.583a.875.875 0 110 1.75H4.042a.875.875 0 01-.875-.875zM7.542 17a.875.875 0 000 1.75h13.415a.875.875 0 100-1.75H7.542z"
        ></Path>
      </G>
    </Svg>
  );
}
