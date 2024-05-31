import { useCallback } from 'react';
import { TokenInfo } from '@features/dex-swap-interface/types';
import { supportedSwapPairs } from '@features/dex-swap-interface/utils/pairs';

interface ButtonActionStringArgs {
  from: TokenInfo;
  to: TokenInfo;
}

export function useDEXSwapActionsHandler() {
  const buttonActionString = useCallback(
    ({ from, to }: ButtonActionStringArgs) => {
      const foundPair = supportedSwapPairs.find((token) => {
        return token.from === from.symbol && token.to === to.symbol;
      });

      if (!foundPair) {
        return 'Unknown';
      } else if (foundPair.label.includes('Approve')) {
        return `${foundPair.label} ${foundPair.to}`;
      }

      return foundPair;
    },
    []
  );

  return {
    buttonActionString
  };
}
