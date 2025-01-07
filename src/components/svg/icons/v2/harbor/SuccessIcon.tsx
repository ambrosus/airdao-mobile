import * as React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop
} from 'react-native-svg';

export const SuccessIcon = ({ scale = 1 }: { scale?: number }) => {
  const width = 64 * scale;
  const height = 64 * scale;

  return (
    <Svg width={width} height={height} fill="none">
      <Circle
        cx={32}
        cy={32}
        r={32}
        fill="url(#a)"
        transform="rotate(90 32 32)"
      />
      <Path
        fill="#16C784"
        d="M58.182 32c0 14.46-11.722 26.182-26.182 26.182C17.54 58.182 5.818 46.46 5.818 32 5.818 17.54 17.54 5.818 32 5.818 46.46 5.818 58.182 17.54 58.182 32Z"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M41.697 24.727 28.364 38.061 22.304 32"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={32}
          x2={32}
          y1={0}
          y2={64}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#73DDB5" />
          <Stop offset={1} stopColor="#73DDB5" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
