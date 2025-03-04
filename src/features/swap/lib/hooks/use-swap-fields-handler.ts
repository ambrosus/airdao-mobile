import { useCallback, useMemo } from 'react';
import { formatEther } from 'ethers/lib/utils';
import debounce from 'lodash/debounce';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useSwapBetterCurrency } from './use-swap-better-currency';
import { useSwapHelpers } from './use-swap-helpers';

export function useSwapFieldsHandler() {
  const {
    setSelectedTokensAmount,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    setIsExactIn,
    setIsExecutingPrice,
    isExactInRef
  } = useSwapContextSelector();

  const { bestTradeCurrency } = useSwapBetterCurrency();
  const { isEmptyAmount } = useSwapHelpers();

  const updateReceivedTokensOutput = useCallback(async () => {
    setIsExecutingPrice(true);
    const isExactIn = isExactInRef.current;
    const oppositeKey = isExactIn ? FIELD.TOKEN_B : FIELD.TOKEN_A;
    const { TOKEN_A, TOKEN_B } = latestSelectedTokens.current;
    const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } =
      latestSelectedTokensAmount.current;

    if (!TOKEN_A || !TOKEN_B) return;

    const path = [TOKEN_A?.address, TOKEN_B.address];
    const amountToSell = isExactIn ? AMOUNT_A : AMOUNT_B;

    if (isEmptyAmount(amountToSell)) return;
    try {
      const bnAmountToReceive = await bestTradeCurrency(amountToSell, path, {
        changeUiHopArray: true
      });

      const normalizedAmount = formatEther(bnAmountToReceive?._hex);

      setSelectedTokensAmount((prevSelectedTokensAmounts) => {
        const currentAmount =
          prevSelectedTokensAmounts[
            isExactInRef.current ? FIELD.TOKEN_A : FIELD.TOKEN_B
          ];
        if (!isEmptyAmount(currentAmount)) {
          return {
            ...latestSelectedTokensAmount.current,
            [oppositeKey]: isEmptyAmount(normalizedAmount)
              ? ''
              : normalizedAmount
          };
        }
        return prevSelectedTokensAmounts;
      });
    } catch (error) {
      throw error;
    } finally {
      setIsExecutingPrice(false);
    }
  }, [
    setIsExecutingPrice,
    isExactInRef,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    isEmptyAmount,
    bestTradeCurrency,
    setSelectedTokensAmount
  ]);

  const debouncedUpdateReceivedTokensOutput = useMemo(
    () => debounce(async () => await updateReceivedTokensOutput(), 100),
    [updateReceivedTokensOutput]
  );

  const onChangeSelectedTokenAmount = useCallback(
    (key: SelectedTokensKeys, amount: string) => {
      const oppositeKey = key === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;
      setIsExactIn(key === FIELD.TOKEN_A);
      setSelectedTokensAmount((prevSelectedTokensAmounts) => ({
        ...prevSelectedTokensAmounts,
        [key]: amount
      }));

      if (isEmptyAmount(amount)) {
        setSelectedTokensAmount((prevSelectedTokensAmounts) => ({
          ...prevSelectedTokensAmounts,
          [oppositeKey]: ''
        }));
      } else {
        Promise.resolve(debouncedUpdateReceivedTokensOutput());
      }
    },
    [
      setIsExactIn,
      setSelectedTokensAmount,
      isEmptyAmount,
      debouncedUpdateReceivedTokensOutput
    ]
  );

  const onSelectMaxTokensAmount = (key: SelectedTokensKeys, amount: string) => {
    setSelectedTokensAmount((prevSelectedTokensAmount) => ({
      ...prevSelectedTokensAmount,
      [key]: amount
    }));
  };

  return {
    onChangeSelectedTokenAmount,
    onSelectMaxTokensAmount,
    updateReceivedTokensOutput
  };
}
