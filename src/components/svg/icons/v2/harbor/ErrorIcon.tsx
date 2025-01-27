import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop
} from 'react-native-svg';

export const ErrorIcon = ({ scale = 1 }: { scale?: number }) => {
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
        fill="#F6465D"
        d="M58.182 32c0 14.46-11.722 26.182-26.182 26.182C17.54 58.182 5.818 46.46 5.818 32 5.818 17.54 17.54 5.818 32 5.818 46.46 5.818 58.182 17.54 58.182 32Z"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M40.438 23.563 23.561 40.438M40.438 40.438 23.561 23.561"
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
          <Stop stopColor="#F6465D" stopOpacity={0.4} />
          <Stop offset={1} stopColor="#F6465D" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
