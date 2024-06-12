import { useCallback, useEffect } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface/service/dex-swap.service';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { NumberUtils } from '@utils/number';
import { useDEXSwapActionsHandler } from './use-dex-swap-actions-handler';

export function useSwapFieldsHandler() {
  const { isSomeTokenNotSelected, isSomeTokenHasEmptyAmount } =
    useDEXSwapActionsHandler();
  const {
    selectedTokensAmount,
    setSelectedTokensAmount,
    lastChangedInput,
    setLastChangedInput,
    selectedTokens
  } = useDEXSwapContextSelector();

  const onApplyOppositeCurrencyAmount = useCallback(
    (key: keyof typeof FIELD, value: number | string) => {
      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: String(value)
      }));
    },
    [setSelectedTokensAmount]
  );

  const onChangeSelectedTokensAmount = useCallback(
    async (key: keyof typeof FIELD, value: string) => {
      setLastChangedInput(key);
      const oppositeKey = key === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
      const isEmpty = value === '' || value === '0';

      setSelectedTokensAmount((prevSelectedTokensAmount) => ({
        ...prevSelectedTokensAmount,
        [key]: value
      }));

      if (selectedTokens.INPUT?.address && selectedTokens.OUTPUT?.address) {
        if (isEmpty && selectedTokens[oppositeKey]) {
          onApplyOppositeCurrencyAmount(oppositeKey, '');
        } else {
          const bnAmountToReceive = await DEXSwapInterfaceService.getAmountsOut(
            {
              path: [
                selectedTokens.INPUT?.address,
                selectedTokens.OUTPUT?.address
              ],
              amountToSell: value
            }
          );

          if (bnAmountToReceive) {
            const receivedTokens = NumberUtils.limitDecimalCount(
              formatEther(bnAmountToReceive?._hex),
              4
            );

            onApplyOppositeCurrencyAmount(oppositeKey, receivedTokens);
          }
        }
      }
    },
    [
      onApplyOppositeCurrencyAmount,
      selectedTokens,
      setLastChangedInput,
      setSelectedTokensAmount
    ]
  );

  // Update tokens amount automatically when some token is not selected
  const updateReceivedTokens = useCallback(async () => {
    if (
      selectedTokens.INPUT?.address &&
      selectedTokens.OUTPUT?.address &&
      lastChangedInput
    ) {
      const bnAmountToReceive = await DEXSwapInterfaceService.getAmountsOut({
        path: [selectedTokens.INPUT?.address, selectedTokens.OUTPUT?.address],
        amountToSell: selectedTokensAmount[lastChangedInput]
      });

      if (bnAmountToReceive) {
        const receivedTokens = NumberUtils.limitDecimalCount(
          formatEther(bnAmountToReceive?._hex),
          4
        );

        const oppositeKey =
          lastChangedInput === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
        onApplyOppositeCurrencyAmount(oppositeKey, receivedTokens);
      }
    }
  }, [
    selectedTokens,
    selectedTokensAmount,
    lastChangedInput,
    onApplyOppositeCurrencyAmount
  ]);

  useEffect(() => {
    if (!lastChangedInput || isSomeTokenNotSelected) return;

    if (isSomeTokenHasEmptyAmount) updateReceivedTokens();
  }, [
    isSomeTokenHasEmptyAmount,
    isSomeTokenNotSelected,
    lastChangedInput,
    selectedTokens,
    selectedTokensAmount,
    updateReceivedTokens
  ]);

  return {
    onChangeSelectedTokensAmount
  };
}
