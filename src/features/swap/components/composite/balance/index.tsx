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
import { ShimmerLoader } from '@components/animations';
import { WalletOutlineIcon } from '@components/svg/icons/v2';
import { ethers } from 'ethers';

interface BalanceProps {
  type: SelectedTokensKeys;
}

export const Balance = ({ type }: BalanceProps) => {
  const { t } = useTranslation();
  const {
    selectedTokens,
    selectedTokensAmount,
    _refExactGetter,
    setIsExactIn
  } = useSwapContextSelector();
  const { onSelectMaxTokensAmount, updateReceivedTokensOutput } =
    useSwapFieldsHandler();

  const { bnBalanceAmount, isFetchingBalance } = useSwapBalance(
    selectedTokens[type]
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
    Number(NumberUtils.limitDecimalCount(selectedTokensAmount[type], 2)),
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
      });
    }
  }, [
    bnBalanceAmount,
    onSelectMaxTokensAmount,
    setIsExactIn,
    type,
    updateReceivedTokensOutput
  ]);

  const disabled = useMemo(() => {
    return bnBalanceAmount?.isZero() || !selectedTokens[type];
  }, [bnBalanceAmount, selectedTokens, type]);

  const maximumTokenBalance = useMemo(() => {
    return !selectedTokens[type] ? '0' : normalizedTokenBalance;
  }, [normalizedTokenBalance, selectedTokens, type]);

  const isUSDPriceNegative = useMemo(() => {
    return USDTokenPrice < 0;
  }, [USDTokenPrice]);

  const containerJustifyContent = useMemo(() => {
    return isUSDPriceNegative ? 'flex-end' : 'space-between';
  }, [isUSDPriceNegative]);

  const error = useMemo(() => {
    if (!bnBalanceAmount || !selectedTokensAmount[type]) return false;

    const bnInputBalance = bnBalanceAmount?._hex;
    const bnSelectedAmount = ethers.utils.parseEther(
      selectedTokensAmount[type]
    );

    if (type === FIELD.TOKEN_A && _refExactGetter) {
      return bnSelectedAmount.gt(bnInputBalance);
    } else if (type === FIELD.TOKEN_B && !_refExactGetter) {
      return bnSelectedAmount.gt(bnInputBalance);
    }
  }, [_refExactGetter, bnBalanceAmount, selectedTokensAmount, type]);

  return (
    <Row alignItems="center" justifyContent={containerJustifyContent}>
      <Row alignItems="center">
        <Row alignItems="center">
          <WalletOutlineIcon
            color={error ? COLORS.error500 : COLORS.neutral500}
          />
          <Spacer horizontal value={4} />
          {isFetchingBalance ? (
            <ShimmerLoader width={45} height={12} />
          ) : (
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={error ? COLORS.error500 : COLORS.neutral500}
            >
              {maximumTokenBalance}
            </Text>
          )}
        </Row>

        {!disabled && (
          <>
            <Spacer horizontal value={scale(4)} />
            <Button onPress={onSelectMaxTokensAmountPress}>
              <Text
                fontSize={15}
                fontFamily="Inter_500Medium"
                color={COLORS.brand600}
              >
                {t('swap.text.button.max')}
              </Text>
            </Button>
          </>
        )}
      </Row>
      {!Number.isNaN(USDTokenPrice) && (
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          ${NumberUtils.limitDecimalCount(USDTokenPrice, 2)}
        </Text>
      )}
    </Row>
  );
};
