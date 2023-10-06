import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';
import { COLORS } from '@constants/colors';

export function ExploreTabIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M14.0566 26.1602C20.6841 26.1602 26.0566 20.7876 26.0566 14.1602C26.0566 7.53274 20.6841 2.16016 14.0566 2.16016C7.42922 2.16016 2.05664 7.53274 2.05664 14.1602C2.05664 20.7876 7.42922 26.1602 14.0566 26.1602ZM13.6327 17.4581C12.311 16.9503 11.2666 15.9059 10.7587 14.5842L8.83963 9.58971C8.68429 9.18543 9.08142 8.7883 9.48569 8.94363L14.4803 10.8627C15.802 11.3705 16.8464 12.4149 17.3543 13.7366L19.2734 18.7312C19.4288 19.1354 19.0317 19.5326 18.6274 19.3772L13.6327 17.4581Z"
        fill={color}
      />
    </Svg>
  );
}
