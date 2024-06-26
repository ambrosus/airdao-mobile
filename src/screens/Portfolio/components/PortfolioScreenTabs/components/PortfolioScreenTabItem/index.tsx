import React, { forwardRef, useCallback } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { styles } from '@screens/Portfolio/components/PortfolioScreenTabs/components/PortfolioScreenTabItem/styles';
import { COLORS } from '@constants/colors';

type Props = {
  onPress: (index: number) => void;
  index: number;
  opacity: Animated.AnimatedInterpolation<number>;
  color?: string;
  ref: React.RefObject<any>;
  children: React.ReactNode;
};

export const PortfolioScreenTabItem = forwardRef<any, Props>((props, ref) => {
  const handlePress = useCallback(() => {
    props.onPress(props.index);
  }, [props]);

  const { opacity, color = COLORS.brand500 } = props;
  return (
    <TouchableOpacity style={styles.tabTitle} onPress={handlePress}>
      <View ref={ref}>
        <Animated.Text style={[styles.tabTitleText, { opacity, color }]}>
          {props.children}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
});
PortfolioScreenTabItem.displayName = 'PortfolioScreenTabItem';
