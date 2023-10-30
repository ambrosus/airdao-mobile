import { QueryResponse } from '@appTypes';
import { ExplorerAccount } from '@models';
import { useAccountByWalletHash } from '@hooks/database';
import { useBalanceOfAddress } from './useBalanceOfAddress';

export const useExplorerAccountFromHash = (
  hash: string
): QueryResponse<ExplorerAccount | null> => {
  const {
    data: account,
    loading: accountLoading,
    error: accountError
  } = useAccountByWalletHash(hash);
  const {
    data: selectedAccountBalance,
    loading: balanceLoading,
    error: balanceError
  } = useBalanceOfAddress(account?.address || '');

  const explorerAccount = account ? ExplorerAccount.fromDBModel(account) : null;

  if (explorerAccount) {
    explorerAccount.ambBalance = Number(selectedAccountBalance.ether);
  }

  return {
    data: explorerAccount,
    loading: balanceLoading || accountLoading,
    error: accountError || balanceError
  };
};
