import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Row, Text } from '@components/base';
import { CloseIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import { styles } from './Toast.styles';
import { ToastOptions, ToastType } from './Toast.types';
import { COLORS } from '@constants/colors';

export const ToastBody = forwardRef((_, ref) => {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const DISTANCE_FROM_EDGE = verticalScale(16);
  const defaultOptions: ToastOptions = useMemo(
    () => ({
      message: '',
      title: '',
      duration: 3500, // ms
      type: ToastType.Top,
      onBodyPress: undefined
    }),
    []
  );

  const [toastVisible, setToastVisible] = useState(false);
  const [options, setOptions] = React.useState<ToastOptions>(defaultOptions);
  const timerRef = useRef<any>(null); // TODO change any

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const hide = useCallback(() => {
    setOptions(defaultOptions);
    setToastVisible(false);
    clearTimer();
  }, [clearTimer, defaultOptions]);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      hide();
    }, options.duration);
  }, [hide, options.duration]);

  const show = useCallback(
    (params: ToastOptions) => {
      setOptions({ ...defaultOptions, ...params });
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

  const onUndoPress = () => {
    if (typeof options.onUndo === 'function') options.onUndo();
  };

  const isTopToast = options.type === ToastType.Top;
  const placement = DISTANCE_FROM_EDGE + (isTopToast ? topInset : bottomInset);

  if (!toastVisible) return null;
  return (
    <Animated.View
      style={[
        styles.containerStyle,
        { top: options.type === ToastType.Top ? placement : undefined },
        { bottom: options.type === ToastType.Top ? undefined : placement }
      ]}
      entering={(isTopToast ? SlideInUp : SlideInDown).duration(
        (options.duration ?? 500) / 2
      )}
      exiting={(isTopToast ? SlideOutUp : SlideOutDown).duration(
        (options.duration ?? 500) / 2
      )}
      testID="Toast_Body"
    >
      <Pressable
        disabled={typeof options.onBodyPress !== 'function'}
        onPress={options.onBodyPress}
      >
        <Row alignItems="center" justifyContent="space-between">
          <View style={{ flex: 4 }}>
            {Boolean(options.title) && (
              <Text
                fontSize={16}
                fontFamily="Inter_600SemiBold"
                color={COLORS.white}
              >
                {options.title}
              </Text>
            )}
            <Text
              fontSize={14}
              fontWeight="400"
              fontFamily="Inter_400Regular"
              color={COLORS.white}
              style={{ flexDirection: 'row', alignItems: 'baseline' }}
            >
              {options.message}
              {typeof options.onUndo === 'function' && (
                <Text
                  onPress={onUndoPress}
                  fontSize={16}
                  fontWeight="600"
                  fontFamily="Inter_600SemiBold"
                  color="#A1A6B2"
                >
                  {' '}
                  Undo
                </Text>
              )}
            </Text>
          </View>
          <Button
            onPress={hide}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <CloseIcon color="#FFFFFF" />
          </Button>
        </Row>
      </Pressable>
    </Animated.View>
  );
});
