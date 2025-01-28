import { Q } from '@nozbe/watermelondb';
import { useQuery } from '@tanstack/react-query';
import { DatabaseTable, QueryResponse } from '@appTypes';
import { Database, WalletDBModel } from '@database';

export const useWalletByHash = (
  hash: string,
  enabled: boolean
): QueryResponse<WalletDBModel | null> => {
  const { data, error, isInitialLoading } = useQuery<WalletDBModel[], Error>(
    ['use-wallet-by-hash', hash],
    async () =>
      (await Database.query(
        DatabaseTable.Wallets,
        Q.where('hash', Q.eq(hash))
      )) as WalletDBModel[],
    { enabled }
  );

  return {
    data: data ? (data.length > 0 ? data[0] : null) : null,
    loading: isInitialLoading,
    error
  };
};
