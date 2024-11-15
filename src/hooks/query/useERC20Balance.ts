import { useQuery } from '@tanstack/react-query';
import { erc20Contracts } from '@lib/erc20/erc20.contracts';
import { useWalletStore } from '@entities/wallet';

/**
 * A custom React Query hook to fetch ERC20 token balance.
 * @param tokenAddress - The address of the ERC20 token.
 * @param ownerAddress - The address of the owner. If not provided, the wallet address will be used.
 * @param enabled
 * @returns An object containing the token balance and a boolean indicating if the query is fetching.
 */
export function useERC20Balance(
  tokenAddress: string,
  ownerAddress?: string,
  enabled = true
) {
  const { wallet } = useWalletStore();
  const isEnabled = !!tokenAddress && enabled;
  const { data, isFetching, refetch } = useQuery(
    ['erc20-balance', tokenAddress],
    () => {
      return erc20Contracts.balanceOf({
        ownerAddress: ownerAddress ?? (wallet?.address as string),
        tokenAddress
      });
    },
    { enabled: isEnabled, refetchOnMount: true }
  );

  return { balance: data || null, isFetching, refetch };
}
