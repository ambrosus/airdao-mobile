import { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedQueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { ExplorerAccountDTO } from '@models/index';
import { ExplorerAccount } from '@models/Explorer';
import { SearchSort } from '@screens/Search/Search.types';
import { PaginatedResponseBody } from '@appTypes/Pagination';

export function useExplorerAccounts(
  sort: SearchSort
): PaginatedQueryResponse<ExplorerAccount[] | undefined> {
  const nextKey = useRef('');
  const {
    data,
    error,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery<PaginatedResponseBody<ExplorerAccountDTO[]>>(
    ['explorer-accounts', sort],
    () => API.explorerService.getExplorerAccounts(20, nextKey.current, sort),
    {
      getNextPageParam: (
        lastPage: PaginatedResponseBody<ExplorerAccountDTO[]>
      ) => {
        if (lastPage.next) {
          nextKey.current = lastPage.next;
          return lastPage.next;
        }
        nextKey.current = '';
        return null;
      }
    }
  );

  return {
    data: data?.pageParams
      ? (data.pages
          .map((page) =>
            page.data.map((ea: ExplorerAccountDTO) => new ExplorerAccount(ea))
          )
          .flat(Number.POSITIVE_INFINITY) as ExplorerAccount[])
      : undefined,
    loading: isInitialLoading || isFetchingNextPage,
    error,
    hasNextPage: !!hasNextPage,
    fetchNextPage
  };
}
