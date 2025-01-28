import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';
import { scale as scaleFunc } from '@utils';

export function TelegramSettingsIcon(props: IconProps) {
  const { scale = 1, color = '#000' } = props;
  const width = scaleFunc(25);
  const height = scaleFunc(24);

  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
      {...props}
    >
      <G clipPath="url(#a)">
        <Path
          fill="#9B9CA5"
          d="M22.707 2.464a.844.844 0 0 0-.859-.147L2.85 9.752a1.333 1.333 0 0 0 .228 2.551L8 13.27v5.489a1.493 1.493 0 0 0 .937 1.39 1.49 1.49 0 0 0 1.642-.35l2.373-2.462 3.766 3.297a1.489 1.489 0 0 0 1.454.3 1.487 1.487 0 0 0 1-1.09L22.979 3.29a.843.843 0 0 0-.27-.826Zm-5.001 17.045-7.752-6.797 11.157-7.996-3.405 14.793Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill={color} d="M.5.009h24v24H.5z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
