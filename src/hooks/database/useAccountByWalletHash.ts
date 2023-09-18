import { QueryResponse } from '@appTypes';
import { AccountDBModel } from '@database';
import { useAllAccounts } from './useAllAccounts';

export const useAccountByWalletHash = (
  hash: string
): QueryResponse<AccountDBModel | null> => {
  const {
    data: allAccounts,
    loading: accountsLoading,
    error
  } = useAllAccounts();
  const accountByHash =
    allAccounts?.length > 0
      ? allAccounts.find((account) => account.wallet?.id === hash) || null
      : null;

  return {
    data: accountByHash,
    loading: accountsLoading,
    error
  };
};
