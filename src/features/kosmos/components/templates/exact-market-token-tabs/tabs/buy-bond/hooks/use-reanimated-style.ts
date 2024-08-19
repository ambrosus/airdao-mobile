import { useEffect } from 'react';
import {
  AnimatedStyleProp,
  useSharedValue,
  withTiming,
  useAnimatedStyle
} from 'react-native-reanimated';

export function useReanimatedStyle(
  isActive: boolean
): AnimatedStyleProp<{ marginTop: number }> {
  const marginTop = useSharedValue(isActive ? 8 : 234);

  useEffect(() => {
    marginTop.value = withTiming(isActive ? 8 : 234, { duration: 500 });
  }, [isActive, marginTop]);

  return useAnimatedStyle(() => {
    return {
      marginTop: marginTop.value
    };
  });
}
