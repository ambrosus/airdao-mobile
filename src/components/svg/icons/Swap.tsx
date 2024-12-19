import React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from './Icon.types';

export function SwapIcon(props: IconProps) {
  const { scale = 1, color = COLORS.brand600 } = props;
  const width = 32;
  const height = 32;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width * scale} ${height * scale}`}
      fill="none"
    >
      <G clip-path="url(#clip0_6429_3594)">
        <Path
          d="M10.385 4.54106C8.82299 4.56957 7.27186 5.17933 6.08059 6.37059C3.63981 8.81137 3.63981 12.7686 6.08059 15.2094C6.29547 15.4243 6.52175 15.62 6.75739 15.7967C7.0888 16.0451 7.15604 16.5152 6.90758 16.8466C6.65911 17.178 6.18902 17.2453 5.8576 16.9968C5.56528 16.7777 5.28521 16.5354 5.01993 16.2701C1.99336 13.2435 1.99336 8.33649 5.01993 5.30993C6.36716 3.9627 8.08814 3.2151 9.84839 3.06731L9.26258 2.4815C8.96969 2.18861 8.96969 1.71373 9.26258 1.42084C9.55547 1.12795 10.0303 1.12795 10.3232 1.42084L12.4446 3.54216C12.7375 3.83506 12.7375 4.30993 12.4446 4.60282L10.3232 6.72414C10.0303 7.01704 9.55547 7.01704 9.26258 6.72414C8.96969 6.43125 8.96969 5.95638 9.26258 5.66348L10.385 4.54106ZM10.615 17.0389C12.177 17.0104 13.7281 16.4006 14.9194 15.2094C17.3602 12.7686 17.3602 8.81132 14.9194 6.37055C14.7045 6.15567 14.4782 5.95998 14.2426 5.78332C13.9112 5.53485 13.844 5.06476 14.0924 4.73334C14.3409 4.40193 14.811 4.33469 15.1424 4.58316C15.4347 4.80232 15.7148 5.04461 15.9801 5.30989C19.0066 8.33645 19.0066 13.2435 15.9801 16.27C14.6328 17.6173 12.9119 18.3649 11.1516 18.5127L11.7374 19.0985C12.0303 19.3914 12.0303 19.8662 11.7374 20.1591C11.4445 20.452 10.9696 20.452 10.6768 20.1591L8.55543 18.0378C8.26254 17.7449 8.26254 17.27 8.55543 16.9771L10.6768 14.8558C10.9696 14.5629 11.4445 14.5629 11.7374 14.8558C12.0303 15.1487 12.0303 15.6236 11.7374 15.9165L10.615 17.0389Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_6429_3594">
          <Rect
            width="20"
            height="20"
            fill="white"
            transform="translate(0.5 0.790039)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
