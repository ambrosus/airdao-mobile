import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedQueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Transaction } from '@models/index';
import { TransactionDTO } from '@models/dtos/TransactionDTO';
import { TransactionType } from '@appTypes/enums';
import { PaginatedResponseBody } from '@appTypes/Pagination';

export function useTransactionsOfAccount(
  address: string,
  page: number,
  limit: number,
  type: TransactionType | '',
  enabled: boolean
): PaginatedQueryResponse<Transaction[]> {
  const {
    data,
    hasNextPage,
    error,
    isInitialLoading,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery<PaginatedResponseBody<TransactionDTO[]>>(
    ['address-transactions', address, page, limit, type],
    () =>
      API.explorerService.getTransactionsOfAccount(
        address,
        (data?.pages.length || 0) + 1,
        limit,
        type
      ) as any,
    {
      enabled,
      getNextPageParam: (lastPage: PaginatedResponseBody<TransactionDTO[]>) => {
        if (lastPage.next) {
          return lastPage.next;
        }
        return null;
      }
    }
  );

  return {
    data: data?.pages
      ? (data.pages
          .map((page) => page.data.map((d) => new Transaction(d)))
          .flat(Number.POSITIVE_INFINITY) as Transaction[])
      : [],
    loading: isInitialLoading || isFetchingNextPage,
    error,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage
  };
}
