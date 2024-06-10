import { useCallback, useMemo } from 'react';

import { supportedSwapPairs } from '@features/dex-swap-interface/utils/pairs';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { FIELD } from '@features/dex-swap-interface/types/fields';

interface ButtonActionStringArgs {
  from: string;
  to: string;
}

export function useDEXSwapActionsHandler() {
  const {
    selectedTokens,
    setSelectedTokens,
    selectedTokensAmount,
    setSelectedTokensAmount
  } = useDEXSwapContextSelector();
  const buttonActionString = useCallback(
    ({ from, to }: ButtonActionStringArgs) => {
      const foundPair = supportedSwapPairs.find((token) => {
        return token.from === from && token.to === to;
      });

      if (!foundPair) {
        return 'Wrong pair';
      } else if (foundPair.label.includes('Approve')) {
        return `${foundPair.label} ${foundPair.to}`;
      }

      return foundPair.label;
    },
    []
  );

  const onReverseSelectedTokens = useCallback(() => {
    setSelectedTokens({
      [FIELD.INPUT]: selectedTokens.OUTPUT,
      [FIELD.OUTPUT]: selectedTokens.INPUT
    });

    setSelectedTokensAmount({
      [FIELD.INPUT]: selectedTokensAmount.OUTPUT,
      [FIELD.OUTPUT]: selectedTokensAmount.INPUT
    });
  }, [
    selectedTokens.INPUT,
    selectedTokens.OUTPUT,
    selectedTokensAmount.INPUT,
    selectedTokensAmount.OUTPUT,
    setSelectedTokens,
    setSelectedTokensAmount
  ]);

  const isSomeTokenNotSelected = useMemo(() => {
    return !selectedTokens.INPUT || !selectedTokens.OUTPUT;
  }, [selectedTokens]);

  return {
    buttonActionString,
    onReverseSelectedTokens,
    isSomeTokenNotSelected
  };
}
