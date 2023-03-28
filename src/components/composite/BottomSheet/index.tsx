import React, {
  PropsWithChildren,
  useCallback,
  useImperativeHandle
} from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import {
  BottomSheetAnimationDuration,
  BottomSheetBorderRadius
} from './BottomSheet.constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BottomSheet = React.forwardRef<
  BottomSheetRef,
  PropsWithChildren<BottomSheetProps>
>(
  (
    {
      height,
      borderRadius = BottomSheetBorderRadius,
      children,
      backdropColor = '#000000'
    },
    ref
  ) => {
    const screen = useWindowDimensions();
    const top = useSharedValue(screen.height);

    // Animates top value
    const updateTop = useCallback((value: number) => {
      'worklet';
      return withTiming(value, {
        duration: BottomSheetAnimationDuration,
        easing: Easing.quad
      });
    }, []);

    // determines if modal is visible
    const isVisible = useDerivedValue<boolean>(() => {
      if (top.value > screen.height - 10) {
        return false;
      } else {
        return true;
      }
    }, [top]);

    const show = () => {
      top.value = updateTop(screen.height - height);
    };

    const dismiss = () => {
      top.value = updateTop(screen.height);
    };

    useImperativeHandle(ref, () => ({
      show,
      dismiss,
      isVisible: isVisible.value
    }));

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      { startHeight: number }
    >({
      onStart: (_, context) => {
        context.startHeight = top.value;
      },
      onActive: (event, context) => {
        //Prevent modal to go up more than it should
        if (context.startHeight + event.translationY > screen.height - height) {
          top.value = context.startHeight + event.translationY;
        }
      },
      onEnd: () => {
        //Determine if modal should close or go back to its original height
        if (top.value > screen.height - height / 2) {
          top.value = updateTop(screen.height);
        } else {
          top.value = updateTop(screen.height - height);
        }
      }
    });

    const containerAnimatedStyle = useAnimatedStyle(() => ({
      top: top.value === screen.height ? top.value + 50 : top.value
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      //Less opaque if top value is larger, vice verca
      opacity: interpolate(
        top.value,
        [screen.height - height, screen.height],
        [0.5, 0]
      ),
      //don't show backdrop component if modal is not present, as it cancels any touch events
      top: isVisible.value ? 0 : screen.height
    }));

    return (
      <View style={styles.fullScreen}>
        <AnimatedPressable
          onPressIn={dismiss}
          style={[
            styles.backdrop,
            { backgroundColor: backdropColor },
            backdropAnimatedStyle
          ]}
        />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.container,
              {
                height: height,
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius
              },
              containerAnimatedStyle
            ]}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
);
