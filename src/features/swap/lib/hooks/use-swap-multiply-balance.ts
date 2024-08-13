import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBridgeContextData } from '@features/bridge/context';
import { useSwapContextSelector } from '@features/swap/context';
import { MultiplyBalancesStateType, SwapToken } from '@features/swap/types';
import { getBalanceOf } from '@features/swap/lib/contracts';

export function useSwapMultiplyBalance() {
  const { selectedAccount } = useBridgeContextData();
  const { selectedTokens } = useSwapContextSelector();

  const [bnBalances, setBnBalances] = useState<MultiplyBalancesStateType>({
    TOKEN_A: null,
    TOKEN_B: null
  });

  const tokens = useMemo(
    () => ({
      tokenA: selectedTokens.TOKEN_A,
      tokenB: selectedTokens.TOKEN_B
    }),
    [selectedTokens]
  );

  const getTokenBalance = useCallback(
    async (token: SwapToken | null) => {
      return token && selectedAccount?.address
        ? getBalanceOf({ token, ownerAddress: selectedAccount.address })
        : Promise.resolve(null);
    },
    [selectedAccount]
  );

  const fetchTokenBalances = useCallback(async () => {
    if (selectedAccount?.address && (tokens.tokenA || tokens.tokenB)) {
      const [balanceA, balanceB] = await Promise.all([
        getTokenBalance(tokens.tokenA),
        getTokenBalance(tokens.tokenB)
      ]);

      setBnBalances({ TOKEN_A: balanceA, TOKEN_B: balanceB });
    }
  }, [getTokenBalance, selectedAccount?.address, tokens.tokenA, tokens.tokenB]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  return { bnBalances };
}
