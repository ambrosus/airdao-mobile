import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function ASTIcon({ scale = 1 }: IconProps) {
  const size = 36 * scale;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.8333 11.9824C21.8333 17.4132 17.4308 21.8158 12 21.8158C6.5692 21.8158 2.16667 17.4132 2.16667 11.9824C2.16667 6.55162 6.5692 2.14909 12 2.14909C17.4308 2.14909 21.8333 6.55162 21.8333 11.9824Z"
        fill="url(#paint0_linear_5050_39457)"
        stroke="#0C0C0D"
        strokeWidth="0.333333"
      />
      <Path
        d="M13.9983 12.5042V10.5028C13.9983 10.2285 13.9448 9.97048 13.8378 9.72873C13.7355 9.48233 13.5937 9.26848 13.4124 9.08717C13.231 8.90586 13.0171 8.76406 12.7707 8.66179C12.5289 8.55486 12.2709 8.50139 11.9965 8.50139C11.7222 8.50139 11.4618 8.55486 11.2153 8.66179C10.9736 8.76406 10.762 8.90586 10.5806 9.08717C10.3993 9.26848 10.2552 9.48233 10.1482 9.72873C10.0459 9.97048 9.99477 10.2285 9.99477 10.5028V12.5042H13.9983ZM16 16.5H13.9983V14.4986H9.99477V16.5H8V10.5028C8 9.94956 8.10462 9.43119 8.31386 8.9477C8.5231 8.45955 8.80674 8.03417 9.16478 7.67155C9.52746 7.30893 9.9506 7.02301 10.4342 6.81381C10.9224 6.6046 11.4432 6.5 11.9965 6.5C12.5498 6.5 13.0683 6.6046 13.5519 6.81381C14.0401 7.02301 14.4656 7.30893 14.8282 7.67155C15.1909 8.03417 15.4769 8.45955 15.6861 8.9477C15.8954 9.43119 16 9.94956 16 10.5028V16.5Z"
        fill="url(#paint1_linear_5050_39457)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_5050_39457"
          x1="2"
          y1="1.98242"
          x2="23.3183"
          y2="20.4616"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2E2E2E" />
          <Stop offset="1" stopColor="#080808" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_5050_39457"
          x1="10.2228"
          y1="6.5"
          x2="18.431"
          y2="12.002"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5CB1FF" />
          <Stop offset="0.503888" stopColor="#33E7FF" />
          <Stop offset="1" stopColor="#00E4C9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
