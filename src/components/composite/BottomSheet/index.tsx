import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { AirDAOEventType } from '@appTypes';
import { Row, Separator, Text } from '@components/base';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useFullscreenModalHeight } from '@hooks/useFullscreenModalHeight';
import { useKeyboardHeight } from '@hooks/useKeyboardHeight';
import { AirDAOEventDispatcher } from '@lib';
import { BottomSheetBorderRadius } from './BottomSheet.constants';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import { Toast } from '../../modular/Toast';

const DEFAULT_BACKDROP_OPACITY = 1;

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      height,
      borderRadius = BottomSheetBorderRadius,
      children,
      isNestedSheet,
      containerStyle,
      avoidKeyboard = true,
      fullscreen = false,
      swiperIconVisible = false,
      onClose,
      testID,
      swipingEnabled = true,
      closeOnBackPress = true,
      onCustomCrossPress,
      onBackdropPress,
      title
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const fullscreenModalHeight = useFullscreenModalHeight();
    const keyboardHeight = useKeyboardHeight();

    useEffect(() => {
      const dismissListener = AirDAOEventDispatcher.subscribe(
        AirDAOEventType.CloseAllModals,
        () => setIsVisible(false)
      );

      return () => {
        dismissListener.unsubscribe();
      };
    }, []);

    const show = useCallback(() => {
      setIsVisible(true);
    }, []);

    const dismiss = useCallback(() => {
      setIsVisible(false);
      Keyboard.dismiss();
      if (typeof onClose === 'function') onClose();
    }, [onClose]);

    const onCrossPress = useCallback(() => {
      setIsVisible(false);
      Keyboard.dismiss();
      if (typeof onCustomCrossPress === 'function') onCustomCrossPress();
    }, [onCustomCrossPress]);

    useImperativeHandle(ref, () => ({
      show,
      dismiss,
      isVisible
    }));

    const content = useMemo(
      () => (
        <View
          style={[
            {
              height: fullscreen
                ? fullscreenModalHeight -
                  (avoidKeyboard
                    ? 0
                    : Platform.OS === 'ios'
                    ? 0
                    : keyboardHeight)
                : height,
              backgroundColor: COLORS.neutral0,
              borderTopRightRadius: borderRadius,
              borderTopLeftRadius: borderRadius
            },
            containerStyle
          ]}
          testID={testID}
        >
          {swiperIconVisible && !title && (
            <View style={styles.swiper}>
              <Separator height={4} color={COLORS.neutral200} />
            </View>
          )}
          {title && (
            <Row
              style={styles.header}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                fontSize={20}
                fontFamily="Inter_600SemiBold"
                color={COLORS.neutral800}
              >
                {title}
              </Text>
              <Pressable
                disabled={!closeOnBackPress}
                onPress={onCrossPress}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.5 : 1
                  }
                ]}
              >
                <CloseCircleIcon />
              </Pressable>
            </Row>
          )}
          {children}
        </View>
      ),
      [
        fullscreen,
        fullscreenModalHeight,
        avoidKeyboard,
        keyboardHeight,
        height,
        borderRadius,
        containerStyle,
        testID,
        swiperIconVisible,
        title,
        closeOnBackPress,
        onCrossPress,
        children
      ]
    );

    const renderBackdropComponent = useMemo(() => {
      const handleBackdropPress = (): void => {
        if (typeof onBackdropPress === 'function') {
          onBackdropPress();
        }

        if (closeOnBackPress) {
          dismiss();
        }
      };

      const backdropOpacity = !isVisible ? 0 : isNestedSheet ? 0 : 0.5;
      return (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View
            style={{
              ...styles.backdrop,
              backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`
            }}
          >
            <Toast />
          </View>
        </TouchableWithoutFeedback>
      );
    }, [isVisible, isNestedSheet, onBackdropPress, closeOnBackPress, dismiss]);

    return (
      <Modal
        testID={testID}
        avoidKeyboard={avoidKeyboard}
        isVisible={isVisible}
        customBackdrop={renderBackdropComponent}
        onDismiss={dismiss}
        swipeDirection={swipingEnabled ? ['down'] : []}
        onSwipeComplete={dismiss}
        useNativeDriverForBackdrop
        propagateSwipe
        onBackButtonPress={() => (closeOnBackPress ? dismiss() : null)}
        onBackdropPress={dismiss}
        backdropOpacity={DEFAULT_BACKDROP_OPACITY}
        style={styles.container}
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
      >
        {content}
      </Modal>
    );
  }
);

export * from './BottomSheet.types';
