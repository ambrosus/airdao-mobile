import React, { forwardRef, useCallback } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { COLORS } from '@constants/colors';

type Props = {
  onPress: (index: number) => void;
  index: number;
  opacity: Animated.AnimatedInterpolation<number>;
  ref: React.RefObject<any>;
  children: React.ReactNode;
};

export const PortfolioScreenTabItem = forwardRef<any, Props>((props, ref) => {
  const handlePress = useCallback(() => {
    props.onPress(props.index);
  }, [props]);

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 16, paddingTop: 16, alignItems: 'center' }}
      onPress={handlePress}
    >
      <View style={{ paddingBottom: 4 }} ref={ref}>
        <Animated.Text
          style={{
            color: COLORS.nero,
            fontSize: 20,
            fontFamily: 'Inter_700Bold',
            opacity: props.opacity
          }}
        >
          {props.children}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
});
PortfolioScreenTabItem.displayName = 'PortfolioScreenTabItem';
