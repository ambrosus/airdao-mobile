import { PropsWithChildren, forwardRef, useImperativeHandle } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export type RotationAnimationRef = {
  rotate: () => unknown;
};

type RotationAnimationProps = {
  initialRotation?: number;
  finalRotation?: number;
  duration?: number;
};

export const RotationAnimation = forwardRef<
  RotationAnimationRef,
  PropsWithChildren<RotationAnimationProps>
>((props, ref) => {
  const {
    children,
    initialRotation = 0,
    finalRotation = 180,
    duration = 300
  } = props;
  const rotation = useSharedValue(initialRotation);

  useImperativeHandle(
    ref,
    () => {
      return {
        rotate() {
          const rotated = rotation.value === finalRotation;
          rotation.value = withTiming(
            rotated ? initialRotation : finalRotation,
            { duration }
          );
        }
      };
    },
    [duration, finalRotation, initialRotation, rotation]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    };
  });

  return (
    <Animated.View testID="AnimatedView" style={animatedStyle}>
      {children}
    </Animated.View>
  );
});
