import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import { MultiplyBalancesStateType, SwapToken } from '@features/swap/types';
import { getBalanceOf } from '@features/swap/lib/contracts';
import { useWallet } from '@hooks';

export function useSwapMultiplyBalance() {
  const { wallet } = useWallet();
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
      return token && wallet?.address
        ? getBalanceOf({ token, ownerAddress: wallet.address })
        : Promise.resolve(null);
    },
    [wallet]
  );

  const fetchTokenBalances = useCallback(async () => {
    if (wallet?.address && (tokens.tokenA || tokens.tokenB)) {
      const [balanceA, balanceB] = await Promise.all([
        getTokenBalance(tokens.tokenA),
        getTokenBalance(tokens.tokenB)
      ]);

      setBnBalances({ TOKEN_A: balanceA, TOKEN_B: balanceB });
    }
  }, [getTokenBalance, tokens.tokenA, tokens.tokenB, wallet?.address]);

  useEffect(() => {
    fetchTokenBalances();
  }, [fetchTokenBalances]);

  return { bnBalances };
}
