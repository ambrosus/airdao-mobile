import { useQuery } from '@tanstack/react-query';
import { TransactionDTO } from '@models/dtos/TransactionDTO';
import { explorerService } from '@api/explorer-service';
import { Transaction } from '@models';
import { TokenUtils } from '@utils';

export function useTransactionDetails(hash: string, enabled = true) {
  const { data, error, isInitialLoading } = useQuery<TransactionDTO, Error>(
    ['transaction-details', hash],
    async () => await explorerService.getTransactionDetails(hash),
    {
      enabled
    }
  );

  return {
    data: data ? new Transaction(data, TokenUtils) : undefined,
    loading: isInitialLoading,
    error
  };
}
