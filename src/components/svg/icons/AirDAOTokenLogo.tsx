import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { ClipPath, Defs, G, Path, Rect, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function AirDAOTokenLogo(props: IconProps) {
  const { scale = 1, color = COLORS.brand500 } = props;
  const width = 33;
  const height = 33;
  const color2 = COLORS.neutral0;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      style={{ transform: [{ scale }] }}
    >
      <Path
        d="M8.84172 3.33306C13.5576 0.610333 19.3679 0.610333 24.0838 3.33306C28.7997 6.05579 31.7048 11.0876 31.7048 16.5331C31.7048 21.9785 28.7997 27.0103 24.0838 29.7331C19.3679 32.4558 13.5576 32.4558 8.84173 29.7331C4.12582 27.0103 1.2207 21.9785 1.2207 16.5331C1.2207 11.0876 4.12582 6.05579 8.84172 3.33306Z"
        fill={color}
      />
      <G clip-path="url(#clip0_1395_5690)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.9625 25.1826C10.8552 25.248 10.7154 25.2177 10.6449 25.1137L10.3746 24.7152C10.3041 24.6112 10.3278 24.4703 10.4268 24.3929C11.3168 23.6965 12.0484 22.9116 12.6237 22.0709C14.766 18.9405 14.766 15.0012 12.6237 11.8708C12.0484 11.0301 11.3168 10.2452 10.4268 9.54876C10.3278 9.47131 10.3041 9.33044 10.3746 9.22642L10.6449 8.828C10.7154 8.72398 10.8552 8.69365 10.9625 8.75907L22.9657 16.0761C23.6356 16.4845 23.6356 17.4572 22.9657 17.8655L10.9625 25.1826Z"
          fill={color2}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1395_5690">
          <Rect
            width="18.4"
            height="18.4"
            fill={color2}
            transform="translate(7.2627 7.33301)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
