import { useCallback } from 'react';

import { supportedSwapPairs } from '@features/dex-swap-interface/utils/pairs';

interface ButtonActionStringArgs {
  from: string;
  to: string;
}

export function useDEXSwapActionsHandler() {
  const buttonActionString = useCallback(
    ({ from, to }: ButtonActionStringArgs) => {
      const foundPair = supportedSwapPairs.find((token) => {
        return token.from === from && token.to === to;
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
