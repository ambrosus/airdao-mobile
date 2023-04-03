import React, { ForwardedRef, forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetAddNewWallet = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    return (
      <BottomSheet height={375} ref={localRef}>
        <Text>123</Text>
      </BottomSheet>
    );
  }
);
