import { useListActions } from '@features/lists';
import { useFetchAddresses } from '@entities/addresses';
import { useFetchLists } from '@entities/lists/lib/hooks/use-fetch-lists';
import { useListNotifications } from '@features/addresses/lib/hooks/use-list-notifications';

export function useListsAndAddressesFetcher() {
  const { onCreateList } = useListActions();

  useFetchAddresses();
  useFetchLists(onCreateList);
  useListNotifications();
}
