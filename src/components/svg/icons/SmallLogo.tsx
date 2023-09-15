import React from 'react';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Mask,
  Path,
  Stop
} from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { COLORS } from '@constants/colors';

export function SmallLogoSVG(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = 23;
  const height = 23;

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Circle cx="11.35" cy="11.3516" r="10.7117" fill="white" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.93837 17.079C7.86352 17.1246 7.76604 17.1034 7.71683 17.0309L7.52836 16.753C7.47916 16.6805 7.49568 16.5822 7.56472 16.5282C8.18547 16.0425 8.69571 15.495 9.09699 14.9086C10.5912 12.7253 10.5912 9.97779 9.09699 7.79446C8.69571 7.2081 8.18547 6.66063 7.56472 6.17492C7.49568 6.1209 7.47916 6.02264 7.52836 5.95009L7.71683 5.67221C7.76604 5.59966 7.86352 5.5785 7.93837 5.62413L16.3101 10.7275C16.7774 11.0123 16.7774 11.6907 16.3101 11.9756L7.93837 17.079Z"
        fill={`url(#paint0_linear_${width}_${height})`}
      />
      <Defs>
        <LinearGradient
          id={`paint0_linear_${width}_${height}`}
          x1="16.6606"
          y1="9.39454"
          x2="7.5"
          y2="9.39455"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={COLORS.brand600} />
          <Stop offset="1" stopColor={COLORS.brand400} />
        </LinearGradient>
        <Mask
          id="a"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="23"
          height="23"
        >
          <Circle cx="11.35" cy="11.3516" r="10.7117" fill="transparent" />
        </Mask>
      </Defs>
      <G mask="url(#a)">
        <Path
          d="M7.93837 17.079C7.86352 17.1246 7.76604 17.1034 7.71683 17.0309L7.52836 16.753C7.47916 16.6805 7.49568 16.5822 7.56472 16.5282C8.18547 16.0425 8.69571 15.495 9.09699 14.9086C10.5912 12.7253 10.5912 9.97779 9.09699 7.79446C8.69571 7.2081 8.18547 6.66063 7.56472 6.17492C7.49568 6.1209 7.47916 6.02264 7.52836 5.95009L7.71683 5.67221C7.76604 5.59966 7.86352 5.5785 7.93837 5.62413L16.3101 10.7275C16.7774 11.0123 16.7774 11.6907 16.3101 11.9756L7.93837 17.079Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
