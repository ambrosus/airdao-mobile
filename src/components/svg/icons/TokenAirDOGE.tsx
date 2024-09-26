import React from 'react';
import { View, Image } from 'react-native';
import { IconProps } from './Icon.types';

export function AirDOGEIcon({ scale = 1 }: IconProps) {
  const width = 32;
  const height = 32;

  return (
    <View
      style={{
        width: width * scale,
        height: height * scale,
        borderRadius: width,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Image
        style={{ width: width * scale, height: height * scale }}
        source={require('@assets/icons/airdoge-token-icon.png')}
      />
    </View>
  );
}
