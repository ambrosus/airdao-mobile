import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { IconProps } from '@components/svg/icons';

export function HomeInactiveIcon(props: IconProps) {
  const { scale = 1, color = '#676B73' } = props;
  const width = 24;
  const height = 24;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: [{ scale }] }}
      fill="none"
    >
      <Path
        d="M11.4079 0.497827C10.5853 -0.162036 9.41473 -0.162036 8.59212 0.497827L0.842125 6.71457C0.309763 7.14161 0 7.7872 0 8.46968V19.7499C0 20.9926 1.00736 21.9999 2.25 21.9999H4.75C5.99264 21.9999 7 20.9926 7 19.7499V14.25C7 13.5596 7.55964 13 8.25 13H11.75C12.4404 13 13 13.5596 13 14.25V19.7499C13 20.9926 14.0074 21.9999 15.25 21.9999H17.75C18.9926 21.9999 20 20.9926 20 19.7499V8.46968C20 7.7872 19.6902 7.14161 19.1579 6.71457L11.4079 0.497827Z"
        fill={color}
      />
    </Svg>
  );
}
