import { useCallback, useMemo } from 'react';

import { supportedSwapPairs } from '@features/dex-swap-interface/utils/pairs';
import { useDEXSwapContextSelector } from '@features/dex-swap-interface/model/dex-swap.context';
import { FIELD } from '@features/dex-swap-interface/types/fields';

interface ButtonActionStringArgs {
  from: string;
  to: string;
}

export function useDEXSwapActionsHandler() {
  const { selectedTokens, setSelectedTokens } = useDEXSwapContextSelector();
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

  const onSwapSelectedTokens = useCallback(() => {
    setSelectedTokens({
      [FIELD.INPUT]: selectedTokens.OUTPUT,
      [FIELD.OUTPUT]: selectedTokens.INPUT
    });
  }, [selectedTokens.INPUT, selectedTokens.OUTPUT, setSelectedTokens]);

  const isSomeTokenNotSelected = useMemo(() => {
    return !selectedTokens.INPUT || !selectedTokens.OUTPUT;
  }, [selectedTokens]);

  return {
    buttonActionString,
    onSwapSelectedTokens,
    isSomeTokenNotSelected
  };
}
