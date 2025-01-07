import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';
import { IconProps } from '../Icon.types';

export function GlobeIcon({ scale = 1, color = COLORS.brand600 }: IconProps) {
  const size = 21;
  const scaled = size * scale;
  return (
    <Svg
      width={scaled}
      height={scaled}
      viewBox={`0 0 ${scaled} ${scaled}`}
      fill="none"
    >
      <Path
        d="M10.4993 18.3337C5.89697 18.3337 2.16602 14.6027 2.16602 10.0003C2.16602 5.39795 5.89697 1.66699 10.4993 1.66699C15.1017 1.66699 18.8327 5.39795 18.8327 10.0003C18.8327 14.6027 15.1017 18.3337 10.4993 18.3337ZM8.59103 16.3898C7.78887 14.6886 7.29712 12.8122 7.18877 10.8337H3.88426C4.21435 13.4807 6.09634 15.6459 8.59103 16.3898ZM8.85827 10.8337C8.9836 12.866 9.56418 14.7751 10.4993 16.4603C11.4345 14.7751 12.0151 12.866 12.1404 10.8337H8.85827ZM17.1144 10.8337H13.8099C13.7016 12.8122 13.2098 14.6886 12.4077 16.3898C14.9023 15.6459 16.7844 13.4807 17.1144 10.8337ZM3.88426 9.16699H7.18877C7.29712 7.18847 7.78887 5.31205 8.59103 3.61079C6.09634 4.35477 4.21435 6.51991 3.88426 9.16699ZM8.85827 9.16699H12.1404C12.0151 7.13468 11.4345 5.22553 10.4993 3.54032C9.56418 5.22553 8.9836 7.13468 8.85827 9.16699ZM12.4077 3.61079C13.2098 5.31205 13.7016 7.18847 13.8099 9.16699H17.1144C16.7844 6.51991 14.9023 4.35477 12.4077 3.61079Z"
        fill={color}
      />
    </Svg>
  );
}
