import React, { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export const Divider = ({ children }: PropsWithChildren) => {
  const containerStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    alignItems: 'center',
    height: 46
  };

  const innerContainerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: 2
  };

  const absolute: StyleProp<ViewStyle> = {
    position: 'absolute'
  };

  return (
    <View style={containerStyle}>
      <View style={innerContainerStyle}>
        <Svg width="100%" height={2} viewBox="0 0 376 2" fill="none">
          <Path
            d="M-1.5 1.12793L378.5 1"
            stroke="url(#paint0_linear_6041_2022)"
          />
          <Defs>
            <LinearGradient
              id="paint0_linear_6041_2022"
              x1="-1.5"
              y1="1.12793"
              x2="378.5"
              y2="1"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#D4D4D4" stopOpacity={0.05} />
              <Stop offset={0.48961} stopColor="#B0B0B0" stopOpacity={0.53} />
              <Stop offset={1} stopColor="#DADADA" stopOpacity={0.05} />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>

      <View style={absolute}>{children}</View>
    </View>
  );
};
