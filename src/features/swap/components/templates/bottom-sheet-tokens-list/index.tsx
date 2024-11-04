import React, { forwardRef, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { styles } from './styles';
import { Spacer } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { useForwardedRef } from '@hooks';
import Config from '@constants/config';
import { scale } from '@utils/scaling';
import { BottomSheetTokenItem } from '@features/swap/components/modular';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { useSwapAllBalances } from '@features/swap/lib/hooks/use-swap-all-balances';

interface BottomSheetTokensListProps {
  type: SelectedTokensKeys;
}

export const BottomSheetTokensList = forwardRef<
  BottomSheetRef,
  BottomSheetTokensListProps
>(({ type }, ref) => {
  const { t } = useTranslation();
  const bottomSheetRef = useForwardedRef(ref);
  const { balances } = useSwapAllBalances();

  const label = type === FIELD.TOKEN_A ? t('swap.pay') : t('swap.receive');

  const renderListCurrencyItem = useCallback(
    (args: ListRenderItemInfo<SwapToken>) => {
      const balanceEntry = balances.find(
        (balance) => Object.keys(balance)[0] === args.item.address
      );

      return (
        <BottomSheetTokenItem
          token={args.item}
          bnBalance={
            balanceEntry?.[args.item.address] ?? ethers.BigNumber.from('0')
          }
          type={type}
        />
      );
    },
    [balances, type]
  );

  return (
    <BottomSheet title={label} ref={bottomSheetRef}>
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
