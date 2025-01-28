import { Path, Svg } from 'react-native-svg';
import { IconProps } from '../../Icon.types';

export const LockIcon = ({ scale = 1, color = '#585E77' }: IconProps) => {
  const size = 20 * scale;
  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 20 20">
      <Path
        fill={color}
        d="M10 14.458a1.358 1.358 0 1 0 0-2.716 1.358 1.358 0 0 0 0 2.716"
      ></Path>
      <Path
        fill={color}
        d="M15.233 7.942V6.9c0-2.25-.541-5.233-5.233-5.233S4.767 4.65 4.767 6.9v1.042c-2.334.291-3.1 1.475-3.1 4.383v1.55c0 3.417 1.041 4.458 4.458 4.458h7.75c3.417 0 4.458-1.041 4.458-4.458v-1.55c0-2.908-.766-4.092-3.1-4.383M10 15.617A2.52 2.52 0 0 1 7.483 13.1 2.52 2.52 0 0 1 10 10.583a2.525 2.525 0 0 1 2.517 2.517A2.514 2.514 0 0 1 10 15.617m-3.875-7.75h-.192V6.9c0-2.442.692-4.067 4.067-4.067s4.067 1.625 4.067 4.067v.975H6.125z"
      ></Path>
    </Svg>
  );
};
