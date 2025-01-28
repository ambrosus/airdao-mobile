import _ from 'lodash';
import { QueryResponse } from '@appTypes';
import { AccountDBModel } from '@database';
import { useAllAccounts } from './useAllAccounts';

export const useAccountByAddress = (
  address: string,
  toLowerCase = false
): QueryResponse<AccountDBModel | null> => {
  const {
    data: allAccounts,
    loading: accountsLoading,
    error
  } = useAllAccounts();
  const accountByHash =
    allAccounts?.length > 0
      ? allAccounts.find(
          (account) =>
            (toLowerCase ? _.toLower(account.address) : account.address) ===
            address
        ) || null
      : null;

  return {
    data: accountByHash,
    loading: accountsLoading,
    error
  };
};
