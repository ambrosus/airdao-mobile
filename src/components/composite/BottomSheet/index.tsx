import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './BottomSheet.styles';
import { BottomSheetProps, BottomSheetRef } from './BottomSheet.types';
import { BottomSheetBorderRadius } from './BottomSheet.constants';
import { KeyboardDismissingView } from '@components/base';

export const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      height,
      borderRadius = BottomSheetBorderRadius,
      children,
      isNestedSheet,
      containerStyle
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

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
              height,
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
      [height, borderRadius, containerStyle, children]
    );
    const backdropOpacity = isNestedSheet ? 0 : 0.5;
    return (
      <Modal
        avoidKeyboard
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
