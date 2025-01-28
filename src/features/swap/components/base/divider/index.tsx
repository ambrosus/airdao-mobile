import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export const Divider = ({ children }: PropsWithChildren) => {
  const containerStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    alignItems: 'center',
    height: 46
  };

  const dividerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: 1,
    backgroundColor: '#D8DAE0'
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
        <View style={dividerStyle} />
      </View>

      <View style={absolute}>{children}</View>
    </View>
  );
};
