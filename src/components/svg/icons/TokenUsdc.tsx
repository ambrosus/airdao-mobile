import { Path, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function UsdcIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 33;
  const height = 33;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        d="M16.621 32.02c8.837 0 16-7.163 16-16 0-8.836-7.163-16-16-16-8.836 0-16 7.164-16 16 0 8.837 7.164 16 16 16z"
        fill="#2775C9"
      />
      <Path
        d="M17 28c-6.628 0-12-5.372-12-12S10.372 4 17 4s12 5.372 12 12a12 12 0 01-12 12zm-.715-16.453a2.635 2.635 0 00-2.502 2.523c0 1.236.756 2.042 2.36 2.38l1.122.265c1.093.255 1.543.623 1.543 1.246S18.02 19.197 17 19.197a1.94 1.94 0 01-1.838-.93.694.694 0 00-.623-.398h-.603a.358.358 0 00-.286.419 2.788 2.788 0 002.666 2.124v.858a.72.72 0 001.44 0v-.868a2.676 2.676 0 002.645-2.635c0-1.297-.746-2.043-2.512-2.42l-1.022-.225c-1.021-.256-1.501-.593-1.501-1.165 0-.572.613-1.205 1.634-1.205a1.675 1.675 0 011.624.828.818.818 0 00.735.47h.48a.429.429 0 00.317-.511 2.706 2.706 0 00-2.43-2.043v-.705a.72.72 0 00-1.44 0v.756zM8.003 16a8.977 8.977 0 006.127 8.507h.143a.46.46 0 00.46-.46v-.214a.96.96 0 00-.593-.888 7.517 7.517 0 010-13.94.95.95 0 00.593-.879v-.235a.43.43 0 00-.572-.408A8.977 8.977 0 008.003 16zm17.994 0a8.976 8.976 0 00-6.127-8.497h-.153a.48.48 0 00-.48.48v.153a1.02 1.02 0 00.623.92 7.517 7.517 0 010 13.93 1.021 1.021 0 00-.613.909v.173a.48.48 0 00.633.45A8.977 8.977 0 0025.997 16z"
        fill="#fff"
      />
    </Svg>
  );
}
