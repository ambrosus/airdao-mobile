import { View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Spinner } from '@components/base';
import { sortListByKey } from '@utils';
import { ListsGroups } from '@screens/Settings/screens/Watchlist/components/ListsOfAddressGroup';
import { useAddressesStore, useFetchAddresses } from '@entities/addresses';
import { useListsSelector } from '@entities/lists';

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
