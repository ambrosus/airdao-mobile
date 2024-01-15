import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { Pressable } from 'react-native';
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '@utils/scaling';
import { ToastOptions, ToastPosition, ToastType } from './Toast.types';
import { AlertBanner } from './Toast.body';

const DEFAULT_DURATION = 2500;

export const ToastWrapper = forwardRef((_, ref) => {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const DISTANCE_FROM_EDGE = verticalScale(16);
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

  const [toastVisible, setToastVisible] = useState(false);
  const [options, setOptions] =
    React.useState<Omit<ToastOptions, 'duration'>>(defaultOptions);
  const duration = useRef(DEFAULT_DURATION);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const hide = useCallback(() => {
    setToastVisible(false);
    setOptions(defaultOptions);
    duration.current = DEFAULT_DURATION;
    clearTimer();
  }, [clearTimer, defaultOptions]);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      hide();
    }, duration.current);
  }, [hide]);

  const show = useCallback(
    (params: ToastOptions) => {
      setOptions({ ...defaultOptions, ...params });
      duration.current = params.duration || DEFAULT_DURATION;
      setToastVisible(true);
      startTimer();
    },
    [defaultOptions, startTimer]
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

  const isTopToast = options.position === ToastPosition.Top;
  const placement = DISTANCE_FROM_EDGE + (isTopToast ? topInset : bottomInset);

  if (!toastVisible) return null;

  return (
    <Animated.View
      style={[
        { position: 'absolute', alignSelf: 'center', zIndex: 1000 },
        { top: isTopToast ? placement : undefined },
        {
          bottom: isTopToast ? undefined : placement
        }
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
        {/* <Row alignItems="center" justifyContent="space-between">
          <View style={styles.statusIcon}>{ToastStatusIcon[options.type]}</View>
          <View style={{ flex: 1 }}>
            <Text
              fontSize={16}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral700}
            >
              {options.text}
            </Text>
            {Boolean(options.subtext) && (
              <>
                <Spacer value={verticalScale(8)} />
                <Text
                  fontSize={14}
                  fontWeight="400"
                  fontFamily="Inter_400Regular"
                  color={COLORS.neutral700}
                  style={{ flexDirection: 'row', alignItems: 'baseline' }}
                >
                  {options.subtext}
                </Text>
              </>
            )}
          </View>
          <Button onPress={hide} style={styles.closeBtn}>
            <CloseIcon color={COLORS.neutral700} />
          </Button>
        </Row>
        {options.actions && options.actions?.length > 0 && (
          <View style={styles.actions}>
            {options.actions?.map(renderAction)}
          </View>
        )} */}
      </Pressable>
    </Animated.View>
  );
});
