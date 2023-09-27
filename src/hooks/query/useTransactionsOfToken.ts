import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedQueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Transaction } from '@models';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import { TransactionDTO } from '@models/dtos/TransactionDTO';

export function useTransactionsOfToken(
  address: string,
  tokenAddress: string,
  page: number,
  limit: number,
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
    ['transactions-of-token', address, page, limit],
    {
      queryFn: ({ pageParam = 1 }) => {
        return API.explorerService.getTokenTransactionsV2(
          address,
          tokenAddress,
          parseInt(pageParam),
          limit
        );
      },
      getNextPageParam: (lastPage: PaginatedResponseBody<TransactionDTO[]>) => {
        if (lastPage.next) {
          return lastPage.next;
        }
        return null;
      },
      enabled
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
