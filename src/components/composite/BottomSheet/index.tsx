import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { Keyboard, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import { BottomSheetBorderRadius } from './BottomSheet.constants';
import { KeyboardDismissingView, Separator } from '@components/base';
import { useFullscreenModalHeight } from '@hooks';
import { useKeyboardHeight } from '@hooks/useKeyboardHeight';
import { COLORS } from '@constants/colors';

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
      onClose
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const fullscreenModalHeight = useFullscreenModalHeight();
    const keyboardHeight = useKeyboardHeight();

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
        <KeyboardDismissingView
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
              backgroundColor: '#FFFFFF',
              borderTopRightRadius: borderRadius,
              borderTopLeftRadius: borderRadius
            },
            containerStyle
          ]}
          testID="bottom-sheet-content"
        >
          {swiperIconVisible && (
            <View style={styles.swiper}>
              <Separator height={4} color={COLORS.lavenderGray} />
            </View>
          )}
          {children}
        </KeyboardDismissingView>
      ),
      [
        fullscreen,
        fullscreenModalHeight,
        avoidKeyboard,
        keyboardHeight,
        height,
        borderRadius,
        containerStyle,
        swiperIconVisible,
        children
      ]
    );

    const backdropOpacity = isNestedSheet ? 0 : 0.5;
    return (
      <Modal
        testID="bottom-sheet"
        avoidKeyboard={avoidKeyboard}
        isVisible={isVisible}
        onDismiss={dismiss}
        swipeDirection={['down']}
        onSwipeComplete={dismiss}
        useNativeDriverForBackdrop
        onBackButtonPress={dismiss}
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
