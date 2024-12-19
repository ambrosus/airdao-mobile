import React, { forwardRef, PropsWithChildren, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { styles } from './styles';

interface BottomSheetTokensListProps extends PropsWithChildren {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const BottomSheetTokensList = forwardRef<
  BottomSheetRef,
  BottomSheetTokensListProps
>(({ title, containerStyle, children }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);

  const combineContainerStyle = useMemo(
    () => [styles.container, containerStyle],
    [containerStyle]
  );

  return (
    <BottomSheet ref={bottomSheetRef} title={title}>
      <View style={combineContainerStyle}>{children}</View>
    </BottomSheet>
  );
});
