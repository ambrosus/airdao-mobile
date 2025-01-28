import { G, Path, Svg } from 'react-native-svg';
import { IconProps } from '../Icon.types';

export function ConnectionChainsIcon({ scale = 1 }: IconProps) {
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
          fill="#23B083"
          d="M8.707 5.407l.942.943a4.667 4.667 0 010 6.6l-.235.235a4.667 4.667 0 01-6.6-6.6l.943.943a3.333 3.333 0 104.714 4.714l.236-.236a3.333 3.333 0 000-4.714l-.943-.942.943-.943zm4.478 4.007l-.943-.943a3.333 3.333 0 00-4.714-4.714l-.236.236a3.333 3.333 0 000 4.714l.943.942-.943.943-.942-.943a4.667 4.667 0 010-6.6l.235-.235a4.667 4.667 0 116.6 6.6z"
        ></Path>
      </G>
    </Svg>
  );
}
