import React from 'react';
import { IconProps } from '@components/svg/icons/Icon.types';
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg';
import { COLORS } from '@constants/colors';

export function StakeRocketIcon(props: IconProps) {
  const { scale = 1, color = COLORS.neutral900 } = props;
  const width = 20,
    height = 20;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      fill="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <G clipPath="url(#prefix__clip0_1307_4319)">
        <Path
          d="M11.057 5.431a2.5 2.5 0 113.536 3.536 2.5 2.5 0 01-3.536-3.536zm2.475 1.06a1 1 0 10-1.414 1.415 1 1 0 001.414-1.414zM17.698.513a2.75 2.75 0 011.81 1.81l.207.665a6.75 6.75 0 01-1.673 6.776l-.998.998a3.498 3.498 0 01-.328 4.568l-1.242 1.242a.75.75 0 01-1.06 0l-1.59-1.59-.177.177a1.75 1.75 0 01-2.475 0l-.487-.487-.811 1.39a.75.75 0 01-1.178.153l-3.89-3.89a.75.75 0 01.146-1.173l1.384-.829-.47-.47a1.75 1.75 0 010-2.475l.18-.18-1.592-1.59a.75.75 0 010-1.062l1.243-1.242a3.498 3.498 0 014.569-.327l.996-.996A6.75 6.75 0 0117.035.307l.663.205zm.378 2.256a1.25 1.25 0 00-.823-.823l-.662-.206a5.25 5.25 0 00-5.269 1.302L5.926 8.438a.25.25 0 000 .353l5.307 5.307a.25.25 0 00.353 0l5.396-5.396a5.25 5.25 0 001.3-5.27l-.206-.664zM4.69 16.395a.75.75 0 00-1.06-1.061l-2.476 2.475a.75.75 0 101.061 1.06l2.475-2.474zm-1.945-3.006a.75.75 0 010 1.061l-1.06 1.06a.75.75 0 11-1.061-1.06l1.06-1.06a.75.75 0 011.061 0zm3.887 4.952a.75.75 0 00-1.06-1.06l-1.059 1.058a.75.75 0 001.06 1.06l1.06-1.058z"
          fill={color}
          fillOpacity={1}
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1307_4319">
          <Path fill="#fff" d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
