import React, { ForwardedRef, forwardRef, RefObject, useCallback } from 'react';
import { Button, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import { BottomSheetFloat } from '@components/modular';
import { Cache, CacheKey } from '@utils/cache';
import { COLORS } from '@constants/colors';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

export const ClearCacheModal = forwardRef<BottomSheetRef, Props>(({}, ref) => {
  const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

  const clearAll = useCallback(() => {
    Object.values(CacheKey).forEach((key) => {
      Cache.deleteItem(key);
    });
    localRef.current?.dismiss();
  }, [localRef]);

  return (
    <BottomSheetFloat
      ref={localRef}
      height={230}
      containerStyle={{ alignItems: 'center' }}
    >
      <Spacer value={30} />
      <Text
        align="center"
        fontFamily="Inter_700Bold"
        fontSize={20}
        color={COLORS.neutral800}
      >
        Press to clear cache, then close (from background too) and open app
      </Text>
      <Spacer value={40} />
      <Button
        type="circular"
        onPress={clearAll}
        style={{
          backgroundColor: COLORS.brand500,
          paddingVertical: 16,
          width: '90%'
        }}
      >
        <Text color="white">Clear all</Text>
      </Button>
    </BottomSheetFloat>
  );
});
