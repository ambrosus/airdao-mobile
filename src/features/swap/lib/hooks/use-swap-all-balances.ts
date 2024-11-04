import { useCallback } from 'react';
import { ethers } from 'ethers';
import Config from '@constants/config';
import { useSwapMultiplyBalance } from './use-swap-multiply-balance';
import { SwapToken } from '@features/swap/types';
import { useSwapContextSelector } from '@features/swap/context';
import { initialBalances } from '@features/swap/utils/balances';

export function useSwapAllBalances() {
  const { getTokenBalance } = useSwapMultiplyBalance();
  const { balances, setBalances, setBalancesLoading } =
    useSwapContextSelector();

  const tokens: SwapToken[] = Config.SWAP_TOKENS;

  const fetchAllBalances = useCallback(async () => {
    const isInitialBalance =
      JSON.stringify(balances) === JSON.stringify(initialBalances);
    try {
      setBalancesLoading(isInitialBalance);
      const balancePromises: Promise<Record<
        string,
        ethers.BigNumber
      > | null>[] = tokens.map(async (token) => {
        const balance = await getTokenBalance(token);
        return balance ? { [token.address]: balance } : null;
      });

      const resolvedBalances = await Promise.all(balancePromises);
      const nonNullBalances = resolvedBalances.filter(
        (balance): balance is Record<string, ethers.BigNumber> =>
          balance !== null
      );

      setBalances(nonNullBalances);
    } catch (error) {
      throw error;
    } finally {
      setBalancesLoading(false);
    }
  }, [balances, getTokenBalance, setBalances, setBalancesLoading, tokens]);

  return { balances, fetchAllBalances };
}
