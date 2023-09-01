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
import { Button, Row, Spacer, Text } from '@components/base';
import { CloseIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';
import {
  ToastAction,
  ToastOptions,
  ToastPosition,
  ToastType
} from './Toast.types';
import { COLORS } from '@constants/colors';
import { ToastBg, ToastBorderColor, ToastStatusIcon } from './Toast.constants';
import { styles } from './Toast.styles';

export const ToastBody = forwardRef((_, ref) => {
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
  const DISTANCE_FROM_EDGE = verticalScale(16);
  const defaultOptions: ToastOptions = useMemo(
    () => ({
      text: 'Y',
      subtext: '',
      type: ToastType.Success,
      position: ToastPosition.Top,
      actions: [],
      onBodyPress: () => null,
      duration: 3500 // ms
    }),
    []
  );

  const [toastVisible, setToastVisible] = useState(true);
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

  const isTopToast = options.position === ToastPosition.Top;
  const placement = DISTANCE_FROM_EDGE + (isTopToast ? topInset : bottomInset);

  if (!toastVisible) return null;

  const renderAction = (action: ToastAction) => {
    return (
      <Button onPress={action.onPress} style={styles.actionBtn}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          fontWeight="500"
          color={COLORS.neutral900}
        >
          {action.label}
        </Text>
      </Button>
    );
  };

  return (
    <Animated.View
      style={[
        styles.containerStyle,
        {
          backgroundColor: ToastBg[options.type],
          borderColor: ToastBorderColor[options.type]
        },
        { top: isTopToast ? placement : undefined },
        {
          bottom: isTopToast ? undefined : placement
        }
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
        )}
      </Pressable>
    </Animated.View>
  );
});
