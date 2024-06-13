import { useCallback, useEffect } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useSwapContextSelector } from '@features/swap/context';
import {
  FIELD,
  SelectedTokensKeys,
  SelectedTokensState
} from '@features/swap/types';
import { useSwapActions } from './use-swap-actions';
import { NumberUtils } from '@utils/number';

export function useSwapFieldsHandler() {
  const { getTokenAmountOut } = useSwapActions();
  const {
    setSelectedTokensAmount,
    selectedTokens,
    lastChangedInput,
    latestSelectedTokens,
    latestSelectedTokensAmount
  } = useSwapContextSelector();

  const updateTokenAmountOut = useCallback(
    async (
      key: SelectedTokensKeys,
      selectedAmount: string,
      tokens: SelectedTokensState
    ) => {
      if (tokens.TOKEN_A && tokens.TOKEN_B) {
        const path = [
          selectedTokens.TOKEN_A?.address,
          selectedTokens.TOKEN_B?.address
        ] as [string, string];

        const bnAmountToReceive = await getTokenAmountOut(selectedAmount, path);

        if (bnAmountToReceive) {
          const oppositeKey =
            key === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;
          const normalizedAmount = NumberUtils.limitDecimalCount(
            formatEther(bnAmountToReceive?._hex),
            4
          );

          setSelectedTokensAmount((prevSelectedTokensAmount) => ({
            ...prevSelectedTokensAmount,
            [oppositeKey]: normalizedAmount
          }));
        }
      }
    },
    [getTokenAmountOut, selectedTokens, setSelectedTokensAmount]
  );

  const onChangeSelectedTokenAmount = useCallback(
    async (key: SelectedTokensKeys, amount: string) => {
      setSelectedTokensAmount((prevSelectedTokensAmount) => {
        const newSelectedTokensAmount = {
          ...prevSelectedTokensAmount,
          [key]: amount
        };

        if (selectedTokens.TOKEN_A && selectedTokens.TOKEN_B) {
          updateTokenAmountOut(
            key,
            newSelectedTokensAmount[key],
            selectedTokens
          );
        }

        return newSelectedTokensAmount;
      });
    },
    [selectedTokens, setSelectedTokensAmount, updateTokenAmountOut]
  );

  const onSelectMaxTokensAmount = (key: SelectedTokensKeys, amount: string) => {
    setSelectedTokensAmount((prevSelectedTokensAmount) => ({
      ...prevSelectedTokensAmount,
      [key]: amount
    }));
  };

  useEffect(() => {
    if (!lastChangedInput) return;

    const key = lastChangedInput;
    const selectedTokensSnapshot = latestSelectedTokens.current;
    const selectedTokensAmountSnapshot = latestSelectedTokensAmount.current;

    if (selectedTokensSnapshot.TOKEN_A && selectedTokensSnapshot.TOKEN_B) {
      const oppositeKey = key === FIELD.TOKEN_A ? FIELD.TOKEN_B : FIELD.TOKEN_A;
      const selectedAmount = selectedTokensAmountSnapshot[oppositeKey];

      updateTokenAmountOut(oppositeKey, selectedAmount, selectedTokensSnapshot);
    }
  }, [
    lastChangedInput,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    updateTokenAmountOut
  ]);

  return {
    onChangeSelectedTokenAmount,
    onSelectMaxTokensAmount,
    updateTokenAmountOut
  };
}
