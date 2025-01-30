import { useMemo, useEffect, useState } from 'react';
import {
  StyleProp,
  ViewStyle,
  Keyboard,
  LayoutAnimation,
  InteractionManager
} from 'react-native';
import { hasNotch } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isExtraSmallScreen } from '@utils';

export function keyboardAvoidingViewOffsetWithNotchSupportedValue(
  value: number
) {
  return !hasNotch() ? 0 : value;
}

export function useKeyboardContainerStyleWithSafeArea(
  style: StyleProp<unknown>
): StyleProp<ViewStyle> {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    let isLayoutAnimationConfigured = false;

    if (!hasNotch()) {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        () => {
          if (!isLayoutAnimationConfigured) {
            InteractionManager.runAfterInteractions(() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
                () => {
                  isLayoutAnimationConfigured = false;
                }
              );
            });
          }
          setKeyboardOpen(true);
        }
      );

      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          if (!isLayoutAnimationConfigured) {
            InteractionManager.runAfterInteractions(() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
                () => {
                  isLayoutAnimationConfigured = false;
                }
              );
            });
          }
          setKeyboardOpen(false);
        }
      );

      return () => {
        keyboardWillHideListener.remove();
        keyboardWillShowListener.remove();
      };
    }
  }, []);

  return useMemo(
    () => ({
      ...(style || {}),
      paddingBottom:
        !hasNotch() && bottomInset === 0
          ? keyboardOpen
            ? 8
            : isExtraSmallScreen
            ? 10
            : 20
          : 0
    }),
    [bottomInset, style, keyboardOpen]
  );
}
