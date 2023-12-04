import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedQueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { Transaction, Token } from '@models';
import { PaginatedResponseBody } from '@appTypes/Pagination';
import { TransactionDTO } from '@models/dtos/TransactionDTO';

export function useTokensAndTransactions(
  address: string,
  page: number,
  limit: number,
  enabled: boolean
): PaginatedQueryResponse<{ tokens: Token[]; transactions: Transaction[] }> {
  const {
    data,
    hasNextPage,
    error,
    isInitialLoading,
    isRefetching,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteQuery<
    PaginatedResponseBody<{
      tokens: Token[];
      transactions: TransactionDTO[];
    }>
  >(['wallet-tokens-and-transactions', address, page, limit], {
    queryFn: ({ pageParam = 1 }) => {
      return API.explorerService.getTransactionsOfAccountV2(
        address,
        parseInt(pageParam),
        limit
      );
    },
    getNextPageParam: (
      lastPage: PaginatedResponseBody<{
        tokens: Token[];
        transactions: TransactionDTO[];
      }>
    ) => {
      if (lastPage.next) {
        return lastPage.next;
      }
      return null;
    },
    enabled,
    refetchInterval: 1 * 60 * 1e3 // 1 min
  });

  const tokens =
    data && data.pages
      ? (data.pages
          .map((page) => page.data.tokens)
          .flat(Number.POSITIVE_INFINITY) as Token[])
      : [];
  // Remove duplicated tokens, occurs while lazy loading transactions
  const uniqueTokenSet = new Set();
  const filteredTokens = tokens.filter((item) => {
    const identifier = `${item.address}-${item.name}`;
    if (!uniqueTokenSet.has(identifier)) {
      uniqueTokenSet.add(identifier);
      return true;
    }
    return false;
  });

  const txMap = new Map<string, boolean>();
  const transactions =
    data && data.pages
      ? (data.pages
          .map((page) =>
            page.data.transactions.map((t) => {
              const transaction = new Transaction(t);
              /**
               *  When user sends from account to the same account we receive 2 transactions with the same transaction hash.
               * */
              const isTransactionDuplicate = txMap.get(transaction.hash);
              transaction.isSent =
                t.from === address && !isTransactionDuplicate;
              txMap.set(transaction.hash, true);
              return transaction;
            })
          )
          .flat(Number.POSITIVE_INFINITY) as Transaction[])
      : [];
  return {
    data: data?.pages
      ? { tokens: filteredTokens, transactions }
      : { tokens: [], transactions: [] },
    loading: isInitialLoading || isFetchingNextPage,
    refetching: isRefetching,
    error,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    refetch
  };
}
