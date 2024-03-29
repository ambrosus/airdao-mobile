import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { Keyboard, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import { BottomSheetBorderRadius } from './BottomSheet.constants';
import { Separator } from '@components/base';
import { useFullscreenModalHeight } from '@hooks/useFullscreenModalHeight';
import { useKeyboardHeight } from '@hooks/useKeyboardHeight';
import { COLORS } from '@constants/colors';
import { AirDAOEventDispatcher } from '@lib';
import { AirDAOEventType } from '@appTypes';

export const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
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
      closeOnBackPress = true
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
          {swiperIconVisible && (
            <View style={styles.swiper}>
              <Separator height={4} color={COLORS.neutral200} />
            </View>
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
        children
      ]
    );

    const backdropOpacity = isNestedSheet ? 0 : 0.5;
    return (
      <Modal
        testID={testID}
        avoidKeyboard={avoidKeyboard}
        isVisible={isVisible}
        onDismiss={dismiss}
        swipeDirection={swipingEnabled ? ['down'] : []}
        onSwipeComplete={dismiss}
        useNativeDriverForBackdrop
        propagateSwipe
        onBackButtonPress={() => (closeOnBackPress ? dismiss() : null)}
        onBackdropPress={dismiss}
        backdropOpacity={backdropOpacity}
        style={styles.container}
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={400}
        backdropTransitionOutTiming={400}
      >
        {content}
      </Modal>
    );
  }
);

export * from './BottomSheet.types';
