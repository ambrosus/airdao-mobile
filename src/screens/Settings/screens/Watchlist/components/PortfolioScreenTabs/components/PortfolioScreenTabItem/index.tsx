import { ReactNode, RefObject, forwardRef, useCallback } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

type Props = {
  onPress: (index: number) => void;
  index: number;
  opacity: Animated.AnimatedInterpolation<number>;
  color?: string;
  ref: RefObject<any>;
  children: ReactNode;
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
