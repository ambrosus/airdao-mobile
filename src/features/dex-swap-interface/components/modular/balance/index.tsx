import React, { useCallback } from 'react';
import { View } from 'react-native';
import { formatEther } from 'ethers/lib/utils';
import { Button, Row, Spacer, Spinner, Text } from '@components/base';
import { useDEXSwapBalance } from '@features/dex-swap-interface/lib/hooks';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { TokenInfo } from '@features/dex-swap-interface/types';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { scale } from '@utils/scaling';
import { useUSDPrice } from '@hooks';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';

interface BalanceProps {
  type: keyof typeof FIELD;
}

export const Balance = ({ type }: BalanceProps) => {
  const { selectedTokens, setLastChangedInput, onChangeSelectedTokensAmount } =
    useDEXSwapContextSelector();
  const { selectedTokenBalance, isFetchingBalance } = useDEXSwapBalance(
    selectedTokens?.[type] as TokenInfo
  );

  const USDTokenPrice = useUSDPrice(
    Number(selectedTokenBalance.beatufied) ?? 0,
    selectedTokens[type]?.symbol as CryptoCurrencyCode
  );

  const onMaxAmonutPress = useCallback(() => {
    const fullAmount = NumberUtils.limitDecimalCount(
      // @ts-ignore
      formatEther(selectedTokenBalance?._hex),
      18
    );

    if (selectedTokenBalance.beatufied) {
      onChangeSelectedTokensAmount(type, fullAmount);
      setLastChangedInput(type);
    }
  }, [
    selectedTokenBalance.beatufied,
    selectedTokenBalance._hex,
    onChangeSelectedTokensAmount,
    type,
    setLastChangedInput
  ]);

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
