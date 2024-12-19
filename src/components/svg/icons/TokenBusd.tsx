import React from 'react';
// import { Image, Defs, Path, Pattern, Svg, Use } from 'react-native-svg';
import { Image, View } from 'react-native';
import { IconProps } from './Icon.types';

export function BusdIcon(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 32 * scale;
  const height = 32 * scale;
  return (
    <View
      style={{
        width,
        height,
        borderRadius: width,
        backgroundColor: '#f0b90b',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Image
        source={require('@assets/images/tokens/busd-token.png')}
        style={{
          width: width * 0.6,
          height: height * 0.6,
          tintColor: 'white'
        }}
      />
    </View>
  );
}
