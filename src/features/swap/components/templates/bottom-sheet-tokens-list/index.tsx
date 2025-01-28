import React, { forwardRef, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacer } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import Config from '@constants/config';
import { DEVICE_HEIGHT } from '@constants/variables';
import { BottomSheetTokenItem } from '@features/swap/components/modular';
import { useSwapAllBalances } from '@features/swap/lib/hooks/use-swap-all-balances';
import { FIELD, SelectedTokensKeys, SwapToken } from '@features/swap/types';
import { useForwardedRef } from '@hooks';
import { scale } from '@utils';
import { styles } from './styles';

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

  const { bottom } = useSafeAreaInsets();

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
      <View style={{ maxHeight: DEVICE_HEIGHT / 2.25 }}>
        <FlatList
          maxToRenderPerBatch={4}
          data={Config.SWAP_TOKENS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyExtractor={(item) => item.symbol}
          renderItem={renderListCurrencyItem}
        />
      </View>
      <Spacer value={scale(bottom === 0 ? 20 : bottom)} />
    </BottomSheet>
  );
});
