import React, { forwardRef } from 'react';
import { useForwardedRef } from '@hooks';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Text } from '@components/base';

export const BottomSheetPreviewSwap = forwardRef<BottomSheetRef, unknown>(
  (_, ref) => {
    const bottomSheetRef = useForwardedRef(ref);
    return (
      <BottomSheet ref={bottomSheetRef}>
        <Text>Preview swap</Text>
      </BottomSheet>
    );
  }
);
