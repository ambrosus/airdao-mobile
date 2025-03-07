import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar10(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 128;
  const height = 128;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0_1387_150)">
        <Path fill="#E6E6E6" d="M.693.956h126.694v128.478H.693z" />
        <Path
          d="M70.495-30.218c13.823-23.318 47.573-23.318 61.397 0l34.448 58.105 33.097 58.886c13.282 23.631-3.593 52.859-30.699 53.172l-67.545.78-67.544-.78c-27.107-.313-43.981-29.541-30.7-53.172l33.098-58.885 34.448-58.106z"
          fill="#457EFF"
          stroke="#191919"
          strokeWidth={5.353}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M94.737 117.056a11.175 11.175 0 017.07 10.393v27.395c0 6.172-5.003 11.174-11.174 11.174H-7.055c-6.172 0-11.174-5.002-11.174-11.174v-16.206c0-6.171-5.003-11.174-11.174-11.174h-.722c-7.58 0-12.96-7.386-10.636-14.6l28.382-88.11c2.535-7.869 12.439-10.356 18.39-4.62L41.853 54.68a11.174 11.174 0 013.42 8.045v27.197c0 4.587 2.803 8.708 7.07 10.393l42.394 16.741z"
          fill="#966CF0"
        />
        <Path
          d="M45.273 89.922h-2.677 2.677zm7.07 10.393l-.984 2.49.983-2.49zM41.852 54.68l-1.858 1.927 1.858-1.927zm3.42 8.045h-2.677 2.677zM-12.38 24.753l2.548.82-2.548-.82zM101.807 127.45h2.676-2.676zm-7.07-10.393l.983-2.489-.983 2.489zm7.07 37.788h2.676-2.676zm2.676 0v-27.395H99.13v27.395h5.353zM-7.055 168.695h97.688v-5.353H-7.055v5.353zm-13.85-30.057v16.206h5.352v-16.206h-5.353zm-9.22-8.498h.722v-5.353h-.722v5.353zm15.198-106.207l-28.381 88.111 5.095 1.641L-9.83 25.574l-5.096-1.641zm58.638 28.82L7.868 18.206 4.154 22.06l35.841 34.546 3.716-3.855zm4.238 37.17V62.724h-5.353v27.197h5.353zm47.771 24.644L53.325 97.826l-1.966 4.979 42.395 16.741 1.966-4.979zM42.596 89.922a13.852 13.852 0 008.763 12.883l1.966-4.98a8.497 8.497 0 01-5.376-7.903h-5.353zm-2.6-33.315a8.497 8.497 0 012.6 6.118h5.353a13.85 13.85 0 00-4.238-9.973l-3.715 3.855zM-9.831 25.574c1.927-5.983 9.459-7.875 13.985-3.513l3.715-3.854c-7.378-7.11-19.654-4.027-22.796 5.726l5.096 1.64zm-20.294 99.213c-5.764 0-9.855-5.616-8.088-11.102l-5.095-1.641c-2.88 8.942 3.788 18.096 13.183 18.096v-5.353zm14.572 13.851c0-7.65-6.2-13.851-13.85-13.851v5.353a8.498 8.498 0 018.497 8.498h5.353zm8.498 24.704a8.498 8.498 0 01-8.498-8.498h-5.353c0 7.65 6.201 13.851 13.85 13.851v-5.353zm111.538-35.893a13.85 13.85 0 00-8.763-12.882l-1.966 4.979a8.497 8.497 0 015.376 7.903h5.353zm-5.353 27.395a8.498 8.498 0 01-8.497 8.498v5.353c7.65 0 13.85-6.201 13.85-13.851H99.13z"
          fill="#191919"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_150">
          <Path
            fill="#fff"
            transform="translate(.693 .956)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
