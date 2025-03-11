import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';

export const EthereumIcon = (props: IconProps) => {
  const { scale = 1 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        fill="#627EEA"
        d="M10 18.319a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667Z"
      />
      <Path
        fill="#fff"
        fillOpacity={0.602}
        d="M10.26 3.736v4.62l3.905 1.744-3.905-6.364Z"
      />
      <Path fill="#fff" d="M10.26 3.736 6.354 10.1l3.906-1.744v-4.62Z" />
      <Path
        fill="#fff"
        fillOpacity={0.602}
        d="M10.26 13.094v3.14l3.907-5.406-3.907 2.266Z"
      />
      <Path fill="#fff" d="M10.26 16.233v-3.14l-3.906-2.265 3.906 5.405Z" />
      <Path
        fill="#fff"
        fillOpacity={0.2}
        d="m10.26 12.368 3.905-2.267-3.905-1.744v4.01Z"
      />
      <Path
        fill="#fff"
        fillOpacity={0.602}
        d="m6.354 10.1 3.906 2.268V8.357L6.354 10.1Z"
      />
    </Svg>
  );
};
