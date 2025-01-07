import { useFetchAddresses } from '@entities/addresses';
import { useFetchLists } from '@entities/lists/lib/hooks/use-fetch-lists';
import { useListNotifications } from '@features/addresses/lib/hooks/use-list-notifications';
import { useListActions } from '@features/lists';

export function useListsAndAddressesFetcher() {
  const { onCreateList } = useListActions();

  useFetchAddresses();
  useFetchLists(onCreateList);
  useListNotifications();
}
