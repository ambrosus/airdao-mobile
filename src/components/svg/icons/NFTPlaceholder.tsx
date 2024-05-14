import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { IconProps } from '@components/svg/icons/Icon.types';

export function NFTPlaceholder(props: IconProps) {
  return (
    <Svg width={137} height={112} fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="#EAECF0"
          d="M126.513 0H9.942C4.577 0 .228 3.582.228 8v96c0 4.418 4.349 8 9.714 8h116.571c5.365 0 9.715-3.582 9.715-8V8c0-4.418-4.35-8-9.715-8Z"
        />
        <G filter="url(#b)" opacity={0.4}>
          <Path
            fill="#fff"
            d="M116.857 51H31.143C27.198 51 24 54.134 24 58v84c0 3.866 3.198 7 7.143 7h85.714c3.945 0 7.143-3.134 7.143-7V58c0-3.866-3.198-7-7.143-7Z"
          />
        </G>
        <G opacity={0.9}>
          <G filter="url(#c)">
            <Path
              fill="#fff"
              d="M109.857 37H24.143C20.198 37 17 40.134 17 44v84c0 3.866 3.198 7 7.143 7h85.714c3.945 0 7.143-3.134 7.143-7V44c0-3.866-3.198-7-7.143-7Z"
            />
          </G>
          <Path
            fill="#D0D5DD"
            d="M49.813 101.716h-22.18c-1.413 0-2.559 1.122-2.559 2.508 0 1.385 1.146 2.508 2.56 2.508h22.18c1.413 0 2.558-1.123 2.558-2.508 0-1.386-1.145-2.508-2.559-2.508Z"
          />
        </G>
        <G filter="url(#d)">
          <Path
            fill="#fff"
            d="M102.857 22H17.143C13.198 22 10 25.166 10 29.071v84.858c0 3.905 3.198 7.071 7.143 7.071h85.714c3.945 0 7.143-3.166 7.143-7.071V29.071c0-3.905-3.198-7.071-7.143-7.071Z"
          />
        </G>
        <Path
          fill="#D0D5DD"
          d="M42.813 87.376h-22.18c-1.413 0-2.559 1.134-2.559 2.534 0 1.399 1.146 2.533 2.56 2.533h22.18c1.413 0 2.558-1.134 2.558-2.533 0-1.4-1.145-2.534-2.559-2.534Z"
        />
        <Path
          fill="#EAECF0"
          d="M58.168 98.355H20.633c-1.413 0-2.559 1.135-2.559 2.534 0 1.399 1.146 2.533 2.56 2.533h37.534c1.414 0 2.56-1.134 2.56-2.533 0-1.4-1.146-2.534-2.56-2.534Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Rect width={136} height={112} x={0.228} fill="#fff" rx={8} />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
export default NFTPlaceholder;
