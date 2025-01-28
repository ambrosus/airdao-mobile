import { Defs, Path, Svg, Pattern, Image, Use } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatarDefault(props: Omit<IconProps, 'color'>) {
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
      <Path
        d="M1 65C1 29.654 29.654 1 65 1c35.346 0 64 28.654 64 64 0 35.346-28.654 64-64 64-35.346 0-64-28.654-64-64z"
        fill="url(#prefix__pattern0)"
      />
      <Path
        d="M1 65C1 29.654 29.654 1 65 1v0c35.346 0 64 28.654 64 64v0c0 35.346-28.654 64-64 64v0c-35.346 0-64-28.654-64-64v0z"
        stroke="#E4E4E7"
      />
      <Defs>
        <Pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use xlinkHref="#prefix__image0_1391_150" transform="scale(.01563)" />
        </Pattern>
        <Image
          id="prefix__image0_1391_150"
          width={64}
          height={64}
          xlinkHref={{
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAONJREFUeF7t20EOhEAIRFG4/6F7DvEnYeFzryQIv6pBd2behOu9dPvsbog+k+NLgArQAqmJcw9iAAhSgZKB3IJkkAySQTJ4CiE+gA8oBeg0mH3Ai084P89HhqwEqIA209ICsQdjAeaZIgaAYKxBDMCAYy8fXwAIgiAIcoJpJEYGI4VjB3YrbC9gL2AvkCB43cM5PgZgAAZgQFnNZAhdGykQBEEQBEEQDBmgAm2glM/z+QUYisYUGoldO7kY32IEAzCg6RgIRgjFAsw+AgRBMNYgBmCAT2TCYfoPPz/HCqQCX1eBHzHnv7C7WhBSAAAAAElFTkSuQmCC'
          }}
        />
      </Defs>
    </Svg>
  );
}
