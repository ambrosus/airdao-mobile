import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { ShimmerLoader } from '@components/animations';
import { Button, Row, Spacer, Text } from '@components/base';
import { WalletOutlineIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { AMB_DECIMALS } from '@constants/variables';
import { useSwapContextSelector } from '@features/swap/context';
import {
  useSwapActions,
  useSwapBalance,
  useSwapBetterCurrency,
  useSwapFieldsHandler
} from '@features/swap/lib/hooks';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useUSDPrice } from '@hooks';
import { NumberUtils, scale } from '@utils';

interface BalanceProps {
  type: SelectedTokensKeys;
  setIsBalanceLoading: Dispatch<SetStateAction<boolean>>;
}

export const Balance = ({ type, setIsBalanceLoading }: BalanceProps) => {
  const { t } = useTranslation();

  const {
    selectedTokens,
    selectedTokensAmount,
    setSelectedTokensAmount,
    setIsExactIn,
    isExecutingPrice,
    setIsInsufficientBalance,
    isExtractingMaxPrice,
    setIsExtractingMaxPrice,
    isPoolsLoading
  } = useSwapContextSelector();
  const { onSelectMaxTokensAmount, updateReceivedTokensOutput } =
    useSwapFieldsHandler();

  const { swapCallback } = useSwapActions();

  const { bestTradeCurrency } = useSwapBetterCurrency();
  const { bnBalanceAmount, isFetchingBalance } = useSwapBalance(
    selectedTokens[type]
  );

  useEffect(() => {
    setIsBalanceLoading(isFetchingBalance);
  }, [isFetchingBalance, setIsBalanceLoading]);

  const normalizedTokenBalance = useMemo(() => {
    if (bnBalanceAmount) {
      return NumberUtils.limitDecimalCount(
        ethers.utils.formatEther(bnBalanceAmount?._hex),
        2
      );
    }

    return '';
  }, [bnBalanceAmount]);

  const USDTokenPrice = useUSDPrice(
    Number(NumberUtils.limitDecimalCount(selectedTokensAmount[type], 2)),
    selectedTokens[type]?.symbol as CryptoCurrencyCode
  );

  const onSelectMaxTokensAmountPress = useCallback(async () => {
    setIsExtractingMaxPrice(true);
    setIsExactIn(type === FIELD.TOKEN_A);

    if (!bnBalanceAmount) return;

    try {
      const parsedBalance = ethers.utils.formatEther(bnBalanceAmount);

      const isNative =
        type === FIELD.TOKEN_A &&
        selectedTokens.TOKEN_A.address === ethers.constants.AddressZero;

      if (isNative) {
        const bnAmountToReceive = await bestTradeCurrency(parsedBalance, [
          selectedTokens.TOKEN_A.address,
          selectedTokens.TOKEN_B.address
        ]);

        const estimatedGas = await swapCallback({
          amountIn: parsedBalance,
          amountOut: ethers.utils.formatEther(bnAmountToReceive),
          estimateGas: true
        });

        const maxSpendableAmount = bnBalanceAmount.sub(estimatedGas);

        if (maxSpendableAmount.lt(0)) {
          setIsInsufficientBalance(true);
          setSelectedTokensAmount({
            [FIELD.TOKEN_A]: '0',
            [FIELD.TOKEN_B]: ''
          });
          return;
        }

        const amount = NumberUtils.limitDecimalCount(
          ethers.utils.formatEther(maxSpendableAmount),
          AMB_DECIMALS
        );

        onSelectMaxTokensAmount(type, amount);
      } else {
        const amount = NumberUtils.limitDecimalCount(
          ethers.utils.formatEther(bnBalanceAmount),
          AMB_DECIMALS
        );

        onSelectMaxTokensAmount(type, amount);
      }

      setTimeout(() => {
        updateReceivedTokensOutput();
      });
    } catch (error) {
      throw error;
    } finally {
      setIsExtractingMaxPrice(false);
    }
  }, [
    bestTradeCurrency,
    bnBalanceAmount,
    onSelectMaxTokensAmount,
    selectedTokens.TOKEN_A.address,
    selectedTokens.TOKEN_B.address,
    setIsExactIn,
    setIsExtractingMaxPrice,
    setIsInsufficientBalance,
    setSelectedTokensAmount,
    swapCallback,
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
    if (
      type === FIELD.TOKEN_B ||
      !bnBalanceAmount ||
      !selectedTokensAmount[FIELD.TOKEN_A] ||
      !isFetchingBalance
    )
      return false;

    const bnInputBalance = bnBalanceAmount?._hex;
    const bnSelectedAmount = ethers.utils.parseEther(
      selectedTokensAmount[FIELD.TOKEN_A]
    );

    return bnSelectedAmount.gt(bnInputBalance);
  }, [bnBalanceAmount, isFetchingBalance, selectedTokensAmount, type]);

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
              color={COLORS[error ? 'error500' : 'neutral500']}
            >
              {maximumTokenBalance}
            </Text>
          )}
        </Row>

        {!disabled && type !== FIELD.TOKEN_B && (
          <>
            <Spacer horizontal value={scale(4)} />
            <Button
              disabled={
                isExecutingPrice || isExtractingMaxPrice || isPoolsLoading
              }
              onPress={onSelectMaxTokensAmountPress}
            >
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
