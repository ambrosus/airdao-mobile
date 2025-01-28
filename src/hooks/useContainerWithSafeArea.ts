import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '@utils';

/**
 * A custom hook that returns a style object with safe area insets applied.
 *
 * @param {StyleProp<unknown>} style - The style object to be merged with the safe area styles.
 * @returns {StyleProp<ViewStyle>} The combined style object with padding based on the bottom safe area inset.
 */
export function useContainerStyleWithSafeArea(
  style: StyleProp<unknown>
): StyleProp<ViewStyle> {
  const { bottom: bottomInset } = useSafeAreaInsets();

  return useMemo(
    () => ({
      ...(style || {}),
      paddingBottom: verticalScale(bottomInset === 0 ? 20 : bottomInset)
    }),
    [bottomInset, style]
  );
}
