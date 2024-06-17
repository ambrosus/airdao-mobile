import { useCallback } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD, SelectedTokensKeys } from '@features/swap/types';
import { useSwapActions } from './use-swap-actions';
import { SwapStringUtils, exactSwapPath } from '@features/swap/utils';

export function useSwapFieldsHandler() {
  const { getOppositeReceivedTokenAmount } = useSwapActions();
  const {
    setSelectedTokensAmount,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    setIsExactIn,
    isExactInRef
  } = useSwapContextSelector();

  const updateReceivedTokensOutput = useCallback(async () => {
    const { TOKEN_A, TOKEN_B } = latestSelectedTokens.current;
    if (!TOKEN_A || !TOKEN_B) return '';

    const path = exactSwapPath(isExactInRef.current, [
      TOKEN_A.address,
      TOKEN_B.address
    ]);

    const key = isExactInRef.current ? FIELD.TOKEN_A : FIELD.TOKEN_B;
    const oppositeKey = isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A;
    const amountToSell = latestSelectedTokensAmount.current[key];

    const bnAmountToReceive = await getOppositeReceivedTokenAmount(
      amountToSell,
      path
    );
    const normalizedAmount = SwapStringUtils.transformAmountValue(
      formatEther(bnAmountToReceive?._hex)
    );

    setSelectedTokensAmount({
      ...latestSelectedTokensAmount.current,
      [oppositeKey]: normalizedAmount
    });
  }, [
    getOppositeReceivedTokenAmount,
    isExactInRef,
    latestSelectedTokens,
    latestSelectedTokensAmount,
    setSelectedTokensAmount
  ]);

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
      } else {
        setTimeout(async () => {
          await updateReceivedTokensOutput();
        }, 250);
      }
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
