import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './Icon.types';
import { COLORS } from '@constants/colors';

export function SuccessIcon(props: IconProps) {
  const { scale = 1, color = COLORS.success300 } = props;
  const width = 88;
  const height = 89;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M43.9999 7.52393C64.2504 7.52393 80.6666 23.9402 80.6666 44.1906C80.6666 64.441 64.2504 80.8573 43.9999 80.8573C23.7495 80.8573 7.33325 64.441 7.33325 44.1906C7.33325 23.9402 23.7495 7.52393 43.9999 7.52393ZM43.9999 12.1073C26.2808 12.1073 11.9166 26.4715 11.9166 44.1906C11.9166 61.9097 26.2808 76.2739 43.9999 76.2739C61.7191 76.2739 76.0833 61.9097 76.0833 44.1906C76.0833 26.4715 61.7191 12.1073 43.9999 12.1073ZM59.8287 32.4868C60.7237 33.3818 60.7237 34.8328 59.8287 35.7277L39.662 55.8944C38.7671 56.7893 37.3161 56.7893 36.4211 55.8944L28.1711 47.6444C27.2762 46.7494 27.2762 45.2984 28.1711 44.4035C29.0661 43.5085 30.5171 43.5085 31.412 44.4035L38.0416 51.033L56.5878 32.4868C57.4827 31.5919 58.9338 31.5919 59.8287 32.4868Z"
        fill={color}
      />
    </Svg>
  );
}