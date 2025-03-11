import { View } from 'react-native';
import { Spinner } from '@components/base';
import { useAddressesStore, useFetchAddresses } from '@entities/addresses';
import { useListsSelector } from '@entities/lists';
import { ListsGroups } from '@screens/Settings/screens/Watchlist/components/ListsOfAddressGroup';
import { sortListByKey } from '@utils';
import { styles } from './styles';

export const Collections = () => {
  const { refetch } = useFetchAddresses();
  const { loading } = useAddressesStore();
  const { listsOfAddressGroup } = useListsSelector();

  return (
    <View style={styles.main}>
      {loading ? (
        <View style={styles.spinnerWrapper}>
          <Spinner />
        </View>
      ) : (
        <ListsGroups
          listsOfAddressGroup={sortListByKey(
            listsOfAddressGroup,
            'totalBalance',
            'desc'
          )}
          onRefresh={refetch}
        />
      )}
    </View>
  );
};
