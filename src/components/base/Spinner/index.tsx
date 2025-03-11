import { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { moderateScale } from '@utils';
import { styles } from './styles';

export interface SpinnerProps {
  containerStyle?: ViewStyle;
  size?: 'large' | 'small' | 'xs';
  customSize?: number;
  color?: string;
}

export function Spinner({
  size = 'small',
  customSize,
  containerStyle,
  color = '#3568DD'
}: SpinnerProps): JSX.Element {
  const _size = customSize || (size === 'small' ? 24 : size === 'xs' ? 20 : 48);
  const radius = _size / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={animatedStyle}>
        <Svg
          width={moderateScale(_size)}
          height={moderateScale(_size)}
          viewBox={`0 0 ${_size} ${_size}`}
        >
          <Circle
            cx={_size / 2}
            cy={_size / 2}
            r={radius}
            stroke={color}
            fill="transparent"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.75}, ${circumference}`}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
