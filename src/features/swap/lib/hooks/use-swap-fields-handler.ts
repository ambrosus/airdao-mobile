import { useCallback } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useSwapActions } from './use-swap-actions';
import { NumberUtils } from '@utils/number';
import { exactSwapPath } from '@features/swap/utils/exact-swap-path';

export function useSwapFieldsHandler() {
  const { getTokenAmountOut } = useSwapActions();
  const {
    setSelectedTokensAmount,

    latestSelectedTokens,
    latestSelectedTokensAmount,
    setIsExactIn
  } = useSwapContextSelector();

  const updateReceivedTokensOutput = useCallback(
    async (isExact: boolean) => {
      const { TOKEN_A, TOKEN_B } = latestSelectedTokens.current;
      if (!TOKEN_A || !TOKEN_B) return '';

      const path = exactSwapPath(isExact, [TOKEN_A.address, TOKEN_B.address]);
      const key = isExact ? FIELD.TOKEN_A : FIELD.TOKEN_B;
      const oppositeKey = isExact ? FIELD.TOKEN_B : FIELD.TOKEN_A;
      const amountToSell = latestSelectedTokensAmount.current[key];

      const bnAmountToReceive = await getTokenAmountOut(amountToSell, path);
      const normalizedAmount = NumberUtils.limitDecimalCount(
        formatEther(bnAmountToReceive?._hex),
        4
      );

      setSelectedTokensAmount({
        ...latestSelectedTokensAmount.current,
        [oppositeKey]: normalizedAmount
      });
    },
    [
      getTokenAmountOut,
      latestSelectedTokens,
      latestSelectedTokensAmount,
      setSelectedTokensAmount
    ]
  );

  const onChangeSelectedTokenAmount = useCallback(
    async (key: SelectedTokensKeys, amount: string) => {
      const isEmpty = amount === '' || amount === '0';
      const oppositeKey = key === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;
      setIsExactIn(key === FIELD.TOKEN_A);
      setSelectedTokensAmount((prevSelectedTokensAmounts) => ({
        ...prevSelectedTokensAmounts,
        [key]: amount
      }));

      if (isEmpty) {
        setSelectedTokensAmount((prevSelectedTokensAmounts) => ({
          ...prevSelectedTokensAmounts,
          [oppositeKey]: amount
        }));
      }

      setTimeout(async () => {
        await updateReceivedTokensOutput(key === FIELD.TOKEN_A);
      }, 250);
    },
    [setIsExactIn, setSelectedTokensAmount, updateReceivedTokensOutput]
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
