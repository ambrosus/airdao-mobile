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
    {
      enabled,
      queryFn: ({ pageParam = 1 }) => {
        return API.explorerService.getTransactionsOfAccount(
          address,
          parseInt(pageParam),
          limit,
          type
        );
      },
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
          .map((page) =>
            page.data.map((d) => {
              const transaction = new Transaction(d);
              transaction.isSent = d.from === address;
              return transaction;
            })
          )
          .flat(Number.POSITIVE_INFINITY) as Transaction[])
      : [],
    loading: isInitialLoading || isFetchingNextPage,
    error,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage
  };
}
