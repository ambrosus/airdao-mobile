import React, { forwardRef, PropsWithChildren, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';

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
