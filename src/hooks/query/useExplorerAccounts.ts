import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedQueryResponse } from '@appTypes/QueryResponse';
import { API } from '@api/api';
import { ExplorerAccountDTO } from '@models/index';
import { ExplorerAccount } from '@models/Explorer';
import { SearchSort } from '@screens/Settings/screens/Explore/Search.types';
import { PaginatedResponseBody } from '@appTypes/Pagination';

const LIMIT = 20;

export function useExplorerAccounts(
  sort: SearchSort
): PaginatedQueryResponse<ExplorerAccount[] | undefined> {
  const {
    data,
    error,
    isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch
  } = useInfiniteQuery<PaginatedResponseBody<ExplorerAccountDTO[]>>(
    ['explorer-accounts', sort],
    {
      queryFn: ({ pageParam = '' }) => {
        return API.explorerService.getExplorerAccounts(LIMIT, pageParam, sort);
      },
      getNextPageParam: (
        lastPage: PaginatedResponseBody<ExplorerAccountDTO[]>
      ) => {
        if (lastPage.next) {
          return lastPage.next;
        }
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
    refetch,
    refetching: isRefetching,
    hasNextPage: !!hasNextPage,
    fetchNextPage
  };
}
