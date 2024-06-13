import { useCallback, useEffect } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useSwapActions } from './use-swap-actions';
import { NumberUtils } from '@utils/number';

export function useSwapFieldsHandler() {
  const { getTokenAmountOut } = useSwapActions();
  const {
    setSelectedTokensAmount,
    selectedTokens,
    selectedTokensAmount,
    lastChangedInput,
    setLastChangedInput
  } = useSwapContextSelector();

  const updateTokenAmountOut = useCallback(
    async (key: SelectedTokensKeys, selectedAmountA: string) => {
      if (selectedTokens.TOKEN_A?.address && selectedTokens.TOKEN_B?.address) {
        const path = [
          selectedTokens.TOKEN_A?.address,
          selectedTokens.TOKEN_B?.address
        ] as [string, string];

        return await getTokenAmountOut(selectedAmountA, path);
      }
    },
    [getTokenAmountOut, selectedTokens]
  );

  const onChangeSelectedTokenAmount = useCallback(
    async (key: SelectedTokensKeys, amount: string) => {
      setLastChangedInput(key);

      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: amount
      }));
    },
    [setLastChangedInput, setSelectedTokensAmount]
  );

  useEffect(() => {
    if (!lastChangedInput) return;

    (async () => {
      const oppositeKey =
        lastChangedInput === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;
      const bnAmountToReceive = await updateTokenAmountOut(
        lastChangedInput,
        selectedTokensAmount[lastChangedInput]
      );

      if (bnAmountToReceive) {
        const normalizedAmount = NumberUtils.limitDecimalCount(
          formatEther(bnAmountToReceive?._hex),
          4
        );

        setSelectedTokensAmount((prevSelectedTokensAmount) => ({
          ...prevSelectedTokensAmount,
          [oppositeKey]: normalizedAmount
        }));
        setLastChangedInput(null);
      }
    })();
  }, [
    lastChangedInput,
    selectedTokensAmount,
    setLastChangedInput,
    setSelectedTokensAmount,
    updateTokenAmountOut
  ]);

  const onSelectMaxTokensAmount = (key: SelectedTokensKeys, amount: string) => {
    setSelectedTokensAmount((prevSelectedTokensAmount) => ({
      ...prevSelectedTokensAmount,
      [key]: amount
    }));
  };

  return { onChangeSelectedTokenAmount, onSelectMaxTokensAmount };
}
