import React, { forwardRef, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import Config from '@constants/config';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BottomSheetTokenItem } from '@features/swap/components/modular';
import { SelectedTokensKeys, SwapToken } from '@features/swap/types';

interface BottomSheetTokensListProps {
  type: SelectedTokensKeys;
}

export const BottomSheetTokensList = forwardRef<
  BottomSheetRef,
  BottomSheetTokensListProps
>(({ type }, ref) => {
  const { t } = useTranslation();
  const bottomSheetRef = useForwardedRef(ref);

  const renderListCurrencyItem = useCallback(
    (args: ListRenderItemInfo<SwapToken>) => (
      <BottomSheetTokenItem token={args.item} type={type} />
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
        {t('swap.select.asset')}
      </Text>
      <Spacer value={scale(16)} />
      <FlatList
        scrollEnabled={false}
        maxToRenderPerBatch={4}
        data={Config.SWAP_TOKENS}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.symbol}
        renderItem={renderListCurrencyItem}
      />
      <Spacer value={scale(56)} />
    </BottomSheet>
  );
});
