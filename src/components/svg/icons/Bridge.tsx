import Svg, { Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export const BridgeIcon = ({ scale = 1, color = '#0C0C0D' }: IconProps) => {
  const width = 16;
  const height = 14;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <Path
        fill={color}
        d="M13.268 12.711l1.513-1.461-1.513-1.461a.75.75 0 111.042-1.08l1.886 1.822a1 1 0 010 1.438L14.31 13.79a.75.75 0 11-1.042-1.079zm-9.534 0L2.22 11.25l1.513-1.461a.75.75 0 00-1.042-1.08L.806 10.532a1 1 0 000 1.438l1.886 1.821a.75.75 0 001.042-1.079zm2.767-1.46a.75.75 0 01-.75.75h-.5a.75.75 0 010-1.5h.5a.75.75 0 01.75.75zm1.75.75a.75.75 0 010-1.5h.5a.75.75 0 010 1.5h-.5zm2.25-.75c0 .415.336.75.75.75h.5a.75.75 0 000-1.5h-.5a.75.75 0 00-.75.75zm5-9.252a2 2 0 00-2-2h-10a2 2 0 00-2 2v4.25a.75.75 0 101.5 0v-4.25a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v4.25a.75.75 0 101.5 0v-4.25z"
      ></Path>
    </Svg>
  );
};
