import { verticalScale } from '@utils/scaling';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomAwareSafeAreaView = (props: ViewProps) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        props.style,
        {
          paddingBottom: Math.max(
            // @ts-ignore
            verticalScale(props.style?.paddingBottom || 16) - bottom,
            0
          )
        }
      ]}
    />
  );
};
