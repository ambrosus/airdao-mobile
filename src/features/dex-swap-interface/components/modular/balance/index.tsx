import React, { useCallback } from 'react';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { useDEXSwapBalance } from '@features/dex-swap-interface/lib/hooks/use-dex-swap-balance';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { TokenInfo } from '@features/dex-swap-interface/types';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { scale } from '@utils/scaling';
import { useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';
import { View } from 'react-native';

interface BalanceProps {
  type: keyof typeof FIELD;
}

export const Balance = ({ type }: BalanceProps) => {
  const { selectedTokens, onChangeSelectedTokensAmount } =
    useDEXSwapContextSelector();
  const { selectedTokenBalance, isFetchingBalance } = useDEXSwapBalance(
    selectedTokens?.[type] as TokenInfo
  );

  const USDTokenPrice = useUSDPrice(
    Number(selectedTokenBalance.beatufied) ?? 0,
    selectedTokens[type]?.symbol as CryptoCurrencyCode
  );

  const onMaxAmonutPress = useCallback(() => {
    if (selectedTokenBalance.beatufied)
      onChangeSelectedTokensAmount(type, selectedTokenBalance.beatufied);
  }, [selectedTokenBalance.beatufied, onChangeSelectedTokensAmount, type]);

  if (isFetchingBalance) {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text>~${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}</Text>

      <Row alignItems="center">
        <Text>{selectedTokenBalance.beatufied}</Text>

        <Spacer horizontal value={scale(16)} />

        <Button disabled={isFetchingBalance} onPress={onMaxAmonutPress}>
          <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#3668DD">
            Max
          </Text>
        </Button>
      </Row>
    </Row>
  );
};
