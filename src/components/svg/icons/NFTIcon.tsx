import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

function NFTIcon(props: IconProps) {
  return (
    <Svg width={35} height={27} fill="none" {...props}>
      <Rect
        width={34.425}
        height={26.425}
        x={0.128}
        y={0.288}
        fill="url(#a)"
        rx={5.213}
      />
      <Path
        fill="#fff"
        d="M6.736 17.5c-.199 0-.382-.036-.54-.102V9.442c.158-.087.275-.117.616-.117a2 2 0 0 1 .718.117l4.19 6.444V9.432c.208-.072.396-.107.564-.107.224 0 .402.035.54.107v7.95c-.143.077-.347.118-.611.118-.234 0-.474-.04-.723-.117l-4.18-6.45H7.3v6.465a1.385 1.385 0 0 1-.564.102Zm8.632-8.175h5.411a.754.754 0 0 1 .189.534c0 .24-.062.413-.189.52H16.62v2.723h3.69c.118.127.179.31.179.55 0 .203-.076.407-.178.504h-3.69v3.227c-.413.158-.84.158-1.253 0V9.325Zm7.09 0h6.424c.127.137.189.31.189.524 0 .23-.062.402-.189.51h-2.596v7.05c-.372.122-.86.122-1.222 0v-7.05h-2.606c-.117-.103-.178-.27-.178-.51 0-.209.061-.387.178-.524Z"
      />
      <Defs>
        <LinearGradient
          id="a"
          x1={28.412}
          x2={-0.792}
          y1={29.746}
          y2={1.23}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F90" />
          <Stop offset={0.604} stopColor="#81D0F2" />
          <Stop offset={1} stopColor="#0DA8FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
export default NFTIcon;
