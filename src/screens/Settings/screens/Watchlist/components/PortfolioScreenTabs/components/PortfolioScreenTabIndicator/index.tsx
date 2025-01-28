import { useEffect } from 'react';
import { Animated } from 'react-native';
import ReAnimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { NavigationState, Route } from 'react-native-tab-view';
import { Measure } from '../types';
import { styles } from './styles';

type Props<T extends Route> = {
  measures: Measure[];
  position: Animated.AnimatedInterpolation<number>;
  navigationState: NavigationState<T>;
};

export const PortfolioScreenTabIndicator = <T extends Route>(
  props: Props<T>
) => {
  const inputRange = props.navigationState.routes.map((_, i) => i);
  const animation = useSharedValue(0);

  useEffect(() => {
    const id = props.position.addListener((value: { value: number }) => {
      animation.value = value.value;
    });

    return () => props.position.removeListener(id);
  }, [animation, props.position]);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      animation.value,
      inputRange,
      props.measures.map((m) => m.width)
    );
    const translateX = interpolate(
      animation.value,
      inputRange,
      props.measures.map((m) => m.x)
    );

    return {
      width,
      transform: [{ translateX }]
    };
  }, []);

  return <ReAnimated.View style={[styles.container, animatedStyle]} />;
};

PortfolioScreenTabIndicator.displayName = 'PortfolioScreenTabIndicator';
