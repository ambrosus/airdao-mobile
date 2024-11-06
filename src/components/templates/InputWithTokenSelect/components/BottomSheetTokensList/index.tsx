import React, { PropsWithChildren, forwardRef, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetTokensListProps extends PropsWithChildren {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const BottomSheetTokensList = forwardRef<
  BottomSheetRef,
  BottomSheetTokensListProps
>(({ title, containerStyle, children }, ref) => {
  const { bottom } = useSafeAreaInsets();

  const bottomSheetRef = useForwardedRef(ref);

  const combineContainerStyle = useMemo(
    () => [styles.container, containerStyle, { paddingBottom: bottom }],
    [bottom, containerStyle]
  );

  return (
    <BottomSheet ref={bottomSheetRef} title={title}>
      <View style={combineContainerStyle}>{children}</View>
    </BottomSheet>
  );
});
