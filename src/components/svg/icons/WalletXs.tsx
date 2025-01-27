import { G, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function WalletXsIcon({
  scale = 1,
  color = COLORS.neutral400
}: IconProps) {
  const width = 16;
  const height = 16;
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
          d="M2.473 3.5a1.5 1.5 0 011.5-1.5h7.5a2 2 0 012 2v.268a2 2 0 011 1.732v6a2 2 0 01-2 2h-7.5a2.5 2.5 0 01-2.5-2.5v-8zm1 0a.5.5 0 00.5.5h8.5a1 1 0 00-1-1h-7.5a.5.5 0 00-.5.5zm7.5 4.5a.5.5 0 100 1h1a.5.5 0 000-1h-1z"
        ></Path>
      </G>
    </Svg>
  );
}
