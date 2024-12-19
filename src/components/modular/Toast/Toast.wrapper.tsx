import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from '@utils';
import { ToastOptions, ToastPosition, ToastType } from './Toast.types';
import { TOAST_DEFAULT_DURATION } from './Toast.constants';
import { AlertBanner } from './Toast.body';

export const ToastWrapper = forwardRef((_, ref) => {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const { height: WINDOW_HEIGHT } = useWindowDimensions();
  const DISTANCE_FROM_EDGE = verticalScale(16);
  const topPlacement = DISTANCE_FROM_EDGE + topInset;
  const bottomPlacement = DISTANCE_FROM_EDGE + bottomInset;

  const defaultOptions: Omit<ToastOptions, 'duration'> = useMemo(
    () => ({
      text: '',
      subtext: '',
      type: ToastType.Failed,
      position: ToastPosition.Top,
      actions: [],
      onBodyPress: () => null
    }),
    []
  );

  const [toastVisible, setToastVisible] = useState(true);
  const [options, setOptions] =
    React.useState<Omit<ToastOptions, 'duration'>>(defaultOptions);
  const duration = useRef(TOAST_DEFAULT_DURATION);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const isTopToast = options.position === ToastPosition.Top;
  const initialPlacement = isTopToast ? -scale(50) : WINDOW_HEIGHT + scale(50);
  const placement = useSharedValue(initialPlacement);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const hide = useCallback(() => {
    placement.value = withTiming(initialPlacement, {
      duration: 500
    });
    setToastVisible(false);
    setOptions(defaultOptions);
    duration.current = TOAST_DEFAULT_DURATION;
    clearTimer();
  }, [clearTimer, defaultOptions, initialPlacement, placement]);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      hide();
    }, duration.current);
  }, [duration, hide]);

  const show = useCallback(
    (params: ToastOptions) => {
      setOptions({ ...defaultOptions, ...params });
      duration.current = params.duration || TOAST_DEFAULT_DURATION;
      placement.value = withTiming(
        isTopToast ? topPlacement : bottomPlacement,
        { duration: 500 }
      );
      setToastVisible(true);
      startTimer();
    },
    [
      bottomPlacement,
      defaultOptions,
      isTopToast,
      placement,
      startTimer,
      topPlacement
    ]
  );

  useImperativeHandle(
    ref,
    React.useCallback(
      () => ({
        show,
        hide
      }),
      [hide, show]
    )
  );

  const animatedPlacement = useAnimatedStyle(() => ({
    //@ts-ignore
    transform: [{ translateY: placement.value }]
  }));
  if (!toastVisible) return null;

  return (
    <Animated.View
      style={[
        { position: 'absolute', alignSelf: 'center', zIndex: 1000 },
        animatedPlacement
      ]}
      entering={isTopToast ? SlideInUp : SlideInDown}
      exiting={isTopToast ? SlideOutUp : SlideOutDown}
      testID="Toast_Body"
    >
      <Pressable
        disabled={typeof options.onBodyPress !== 'function'}
        onPress={options.onBodyPress}
      >
        <AlertBanner {...options} hideVisible={true} onHide={hide} />
      </Pressable>
    </Animated.View>
  );
});
