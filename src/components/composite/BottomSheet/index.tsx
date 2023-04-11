import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { Keyboard, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import { BottomSheetBorderRadius } from './BottomSheet.constants';
import { KeyboardDismissingView } from '@components/base';
import { useFullscreenModalHeight } from '@hooks';
import { useKeyboardHeight } from '@hooks/useKeyboardHeight';

export const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      height,
      borderRadius = BottomSheetBorderRadius,
      children,
      isNestedSheet,
      containerStyle,
      avoidKeyboard = true,
      fullscreen = false
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
    }, []);

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
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius
            },
            containerStyle
          ]}
        >
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
        children
      ]
    );

    const backdropOpacity = isNestedSheet ? 0 : 0.5;

    return (
      <Modal
        avoidKeyboard={avoidKeyboard}
        isVisible={isVisible}
        onDismiss={dismiss}
        swipeDirection="down"
        onSwipeComplete={dismiss}
        propagateSwipe
        onBackButtonPress={dismiss}
        onBackdropPress={dismiss}
        backdropOpacity={backdropOpacity}
        style={styles.container}
      >
        {content}
      </Modal>
    );
  }
);

export * from './BottomSheet.types';
