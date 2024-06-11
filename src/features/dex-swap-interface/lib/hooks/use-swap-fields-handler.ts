import { useCallback, useEffect } from 'react';
import { formatEther } from 'ethers/lib/utils';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface/service/dex-swap.service';
import { FIELD } from '@features/dex-swap-interface/types/fields';
import { NumberUtils } from '@utils/number';

export function useSwapFieldsHandler() {
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
        const receivedTokens = await DEXSwapInterfaceService.getAmountsOut({
          path: [selectedTokens.INPUT?.address, selectedTokens.OUTPUT?.address],
          amountToSell: value
        });

        if (selectedTokens[oppositeKey] && receivedTokens) {
          onApplyOppositeCurrencyAmount(
            oppositeKey,
            isEmpty ? '' : receivedTokens
          );
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

  useEffect(() => {
    if (!lastChangedInput) return;

    const oppositeKey =
      lastChangedInput === FIELD.INPUT ? FIELD.OUTPUT : FIELD.INPUT;
    const oppositeValue = selectedTokensAmount[oppositeKey];

    const updateReceivedTokens = async () => {
      if (selectedTokens.INPUT?.address && selectedTokens.OUTPUT?.address) {
        const bnAmountToReceive = await DEXSwapInterfaceService.getAmountsOut({
          path: [selectedTokens.INPUT?.address, selectedTokens.OUTPUT?.address],
          amountToSell: selectedTokensAmount[lastChangedInput]
        });

        const receivedTokens = NumberUtils.limitDecimalCount(
          formatEther(bnAmountToReceive?._hex),
          4
        );

        if (selectedTokens[oppositeKey] && receivedTokens) {
          onApplyOppositeCurrencyAmount(
            oppositeKey,
            selectedTokensAmount[lastChangedInput] === '' ? '' : receivedTokens
          );
        }
      }
    };

    if (oppositeValue === '' && selectedTokens[oppositeKey]) {
      updateReceivedTokens();
      setLastChangedInput(null);
    }
  }, [
    selectedTokens,
    onApplyOppositeCurrencyAmount,
    setLastChangedInput,
    lastChangedInput,
    selectedTokensAmount
  ]);

  return {
    onChangeSelectedTokensAmount
  };
}
