import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWalletStore } from '@entities/wallet';
import { useSwapContextSelector } from '@features/swap/context';
import { MultiplyBalancesStateType, SwapToken } from '@features/swap/types';
import { erc20Contracts } from '@lib/erc20/erc20.contracts';

export function useSwapMultiplyBalance() {
  const { wallet } = useWalletStore();
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
        ? erc20Contracts.balanceOf({
            tokenAddress: token.address,
            ownerAddress: wallet.address
          })
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

  return { bnBalances, getTokenBalance };
}
