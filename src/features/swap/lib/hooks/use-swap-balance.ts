import { SwapToken } from '@features/swap/types';
import { useEffect, useState } from 'react';

export function useSwapBalance(token: SwapToken | null) {
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  useEffect(() => {
    if (token) {
      setIsFetchingBalance(false);
    }
  }, [token]);

  return { isFetchingBalance };
}
