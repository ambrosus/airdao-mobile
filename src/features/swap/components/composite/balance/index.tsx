import React, { useCallback, useEffect, useMemo } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { Button, Row, Spacer, Text } from '@components/base';
import { SelectedTokensKeys } from '@features/swap/types';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapActions,
  useSwapBalance,
  useSwapFieldsHandler
} from '@features/swap/lib/hooks';
import { NumberUtils } from '@utils/number';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { COLORS } from '@constants/colors';
import { WalletXsIcon } from '@components/svg/icons';

interface BalanceProps {
  type: SelectedTokensKeys;
}

export const Balance = ({ type }: BalanceProps) => {
  const { selectedTokens, selectedTokensAmount, isExactIn } =
    useSwapContextSelector();
  const { onSelectMaxTokensAmount, updateReceivedTokensOutput } =
    useSwapFieldsHandler();
  const { checkAllowance } = useSwapActions();
  const { bnBalanceAmount, isFetchingBalance } = useSwapBalance(
    selectedTokens[type],
    type
  );

  const normalizedTokenBalance = useMemo(() => {
    if (bnBalanceAmount) {
      return NumberUtils.limitDecimalCount(
        formatEther(bnBalanceAmount?._hex),
        2
      );
    }

    return '';
  }, [bnBalanceAmount]);

  useEffect(() => {
    if (selectedTokensAmount.TOKEN_A !== '') checkAllowance();
  }, [checkAllowance, selectedTokensAmount.TOKEN_A]);

  const USDTokenPrice = useUSDPrice(
    Number(NumberUtils.limitDecimalCount(normalizedTokenBalance, 2)),
    selectedTokens[type]?.symbol as CryptoCurrencyCode
  );

  const onSelectMaxTokensAmountPress = useCallback(() => {
    if (bnBalanceAmount) {
      const fullAmount = NumberUtils.limitDecimalCount(
        formatEther(bnBalanceAmount?._hex),
        18
      );
      onSelectMaxTokensAmount(type, fullAmount);

      setTimeout(async () => {
        await updateReceivedTokensOutput(isExactIn);
      }, 250);
    }
  }, [
    bnBalanceAmount,
    isExactIn,
    onSelectMaxTokensAmount,
    type,
    updateReceivedTokensOutput
  ]);

  if (isFetchingBalance) {
    return <Text>loading</Text>;
  }

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral400}
      >
        ~${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}
      </Text>

      <Row alignItems="center">
        <Row alignItems="center">
          <WalletXsIcon />
          <Spacer horizontal value={4} />
          <Text
            fontSize={14}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral400}
          >
            {normalizedTokenBalance}
          </Text>
        </Row>

        <Spacer horizontal value={scale(16)} />

        <Button onPress={onSelectMaxTokensAmountPress}>
          <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#3668DD">
            Max
          </Text>
        </Button>
      </Row>
    </Row>
  );
};
