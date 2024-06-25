import React, { useCallback, useMemo } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { scale } from '@utils/scaling';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapBalance, useSwapFieldsHandler } from '@features/swap/lib/hooks';
import { NumberUtils } from '@utils/number';
import { useUSDPrice } from '@hooks';
import { CryptoCurrencyCode } from '@appTypes';
import { COLORS } from '@constants/colors';
import { WalletXsIcon } from '@components/svg/icons';
import { ShimmerLoader } from '@components/animations';

interface BalanceProps {
  type: SelectedTokensKeys;
}

export const Balance = ({ type }: BalanceProps) => {
  const { t } = useTranslation();
  const { selectedTokens, setIsExactIn } = useSwapContextSelector();
  const { onSelectMaxTokensAmount, updateReceivedTokensOutput } =
    useSwapFieldsHandler();

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
      setIsExactIn(type === FIELD.TOKEN_A);

      setTimeout(async () => {
        await updateReceivedTokensOutput();
      }, 250);
    }
  }, [
    bnBalanceAmount,
    onSelectMaxTokensAmount,
    setIsExactIn,
    type,
    updateReceivedTokensOutput
  ]);

  const maximumTokenBalance = useMemo(() => {
    return !selectedTokens[type] ? '0' : normalizedTokenBalance;
  }, [normalizedTokenBalance, selectedTokens, type]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      {isFetchingBalance ? (
        <ShimmerLoader width={45} height={12} />
      ) : (
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral400}
        >
          ~${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}
        </Text>
      )}

      <Row alignItems="center">
        <Row alignItems="center">
          <WalletXsIcon />
          <Spacer horizontal value={4} />
          {isFetchingBalance ? (
            <ShimmerLoader width={45} height={12} />
          ) : (
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral400}
            >
              {maximumTokenBalance}
            </Text>
          )}
        </Row>

        <Spacer horizontal value={scale(16)} />

        <Button onPress={onSelectMaxTokensAmountPress}>
          <Text fontSize={14} fontFamily="Inter_600SemiBold" color="#3668DD">
            {t('swap.text.button.max')}
          </Text>
        </Button>
      </Row>
    </Row>
  );
};
