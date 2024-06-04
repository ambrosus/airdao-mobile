import React, { forwardRef, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { useForwardedRef } from '@hooks';
import Config from '@constants/config';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BottomSheetCurrencyItem } from './components/bottom-sheet-currency-item';
import { TokenInfo } from '@features/dex-swap-interface/types';

interface BottomSheetCurrenciesListProps {
  type: keyof typeof FIELD;
}

export const BottomSheetCurrenciesList = forwardRef<
  BottomSheetRef,
  BottomSheetCurrenciesListProps
>(({ type }, ref) => {
  const bottomSheetRef = useForwardedRef(ref);

  const renderListCurrencyItem = useCallback(
    (args: ListRenderItemInfo<TokenInfo>) => (
      <BottomSheetCurrencyItem currency={args.item} type={type} />
    ),
    [type]
  );

  return (
    <BottomSheet swiperIconVisible ref={bottomSheetRef}>
      <Spacer value={scale(16)} />
      <Text
        fontSize={20}
        fontFamily="Inter_600SemiBold"
        color={COLORS.neutral900}
        style={styles.heading}
      >
        Select assets
      </Text>
      <Spacer value={scale(16)} />
      <FlatList
        scrollEnabled={false}
        maxToRenderPerBatch={4}
        data={Config.DEX_SUPPORTED_TOKENS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.symbol}
        renderItem={renderListCurrencyItem}
      />
      <Spacer value={scale(32)} />
    </BottomSheet>
  );
});
