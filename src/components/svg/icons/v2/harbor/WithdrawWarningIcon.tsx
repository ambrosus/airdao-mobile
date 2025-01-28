import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../../Icon.types';

export const WithdrawWarningIcon = ({
  scale = 1,
  color = COLORS.neutral0
}: IconProps) => {
  const size = 20 * scale;
  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 20 20">
      <Path
        fill={color}
        d="m16.258 4.875-4.95-2.858a2.64 2.64 0 0 0-2.625 0L3.742 4.875A2.63 2.63 0 0 0 2.433 7.15v5.7c0 .933.5 1.8 1.309 2.275l4.95 2.858a2.64 2.64 0 0 0 2.625 0l4.95-2.858a2.63 2.63 0 0 0 1.308-2.275v-5.7a2.66 2.66 0 0 0-1.317-2.275M9.375 6.458A.63.63 0 0 1 10 5.833a.63.63 0 0 1 .625.625v4.375a.63.63 0 0 1-.625.625.63.63 0 0 1-.625-.625zm1.392 7.4q-.063.15-.175.275a.825.825 0 0 1-.909.175.9.9 0 0 1-.275-.175 1.2 1.2 0 0 1-.183-.275.8.8 0 0 1-.058-.316c0-.217.083-.434.241-.592a.9.9 0 0 1 .275-.175.83.83 0 0 1 .909.175.9.9 0 0 1 .175.275.8.8 0 0 1 .066.317.8.8 0 0 1-.066.316"
      ></Path>
    </Svg>
  );
};
