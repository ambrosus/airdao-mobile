import React from 'react';
import { Ellipse, Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function StayInformedIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 420,
    height = 300;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M82.913 188.775a15 15 0 012.048-17.159l103.652-115.21c7.39-8.215 20.826-5.89 25.025 4.332l62.314 151.667c3.951 9.616-2.841 20.238-13.227 20.686L149.57 237.98v32.188c0 7.179-5.82 13-13 13-7.179 0-13-5.821-13-13v-31.065l-3.794.164a15.004 15.004 0 01-12.366-5.62l-13.149 7.592c-7.174 4.142-16.348 1.684-20.49-5.491l-9.759-16.902c-4.142-7.174-1.684-16.348 5.49-20.49l14.168-8.179-.757-1.402z"
        fill="#C9D9FF"
      />
      <Ellipse
        cx={244.335}
        cy={131.975}
        rx={56.332}
        ry={104.972}
        transform="rotate(-15 244.335 131.975)"
        fill="#1A3D8D"
      />
      <Path
        d="M221 76.693a3 3 0 013-3h7.26a3 3 0 003-3V63a3 3 0 013-3h6.48a3 3 0 013 3v7.693a3 3 0 003 3H257a3 3 0 013 3v5.7a3 3 0 01-3 3h-7.26a3 3 0 00-3 3V96a3 3 0 01-3 3h-6.48a3 3 0 01-3-3v-7.607a3 3 0 00-3-3H224a3 3 0 01-3-3v-5.7z"
        fill="#2DBA8D"
      />
      <Path
        d="M342 69a3 3 0 01-3 3h-24a3 3 0 01-3-3v-5a3 3 0 013-3h24a3 3 0 013 3v5z"
        fill="#FD6E65"
      />
      <Path
        d="M312 188.693a3 3 0 013-3h7.26a3 3 0 003-3V175a3 3 0 013-3h6.48a3 3 0 013 3v7.693a3 3 0 003 3H348a3 3 0 013 3v5.7a3 3 0 01-3 3h-7.26a3 3 0 00-3 3V208a3 3 0 01-3 3h-6.48a3 3 0 01-3-3v-7.607a3 3 0 00-3-3H315a3 3 0 01-3-3v-5.7zM255 51.693a3 3 0 013-3h7.26a3 3 0 003-3V38a3 3 0 013-3h6.48a3 3 0 013 3v7.693a3 3 0 003 3H291a3 3 0 013 3v5.7a3 3 0 01-3 3h-7.26a3 3 0 00-3 3V71a3 3 0 01-3 3h-6.48a3 3 0 01-3-3v-7.607a3 3 0 00-3-3H258a3 3 0 01-3-3v-5.7z"
        fill="#2DBA8D"
      />
      <Path
        d="M371 214a3 3 0 01-3 3h-23a3 3 0 01-3-3v-7a3 3 0 013-3h23a3 3 0 013 3v7z"
        fill="#FD6E65"
      />
    </Svg>
  );
}
