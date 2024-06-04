import React, { forwardRef } from 'react';
import { FlatList } from 'react-native';
import { Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import Config from '@constants/config';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { useForwardedRef } from '@hooks';

interface BottomSheetCurrencySelectProps {
  type: keyof typeof FIELD;
}

export const BottomSheetCurrencySelect = forwardRef<
  BottomSheetRef,
  BottomSheetCurrencySelectProps
>(({ type }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);

  const _item = () => {
    return <Text>type - {type}</Text>;
  };

  return (
    <BottomSheet ref={bottomSheetRef}>
      <FlatList
        data={Config.DEX_SUPPORTED_TOKENS}
        keyExtractor={(item) => item.symbol}
        renderItem={_item}
      />
    </BottomSheet>
  );
});
