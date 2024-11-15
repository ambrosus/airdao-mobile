import { View } from 'react-native';
import React from 'react';
import { useAllAddressesContext, useLists } from '@contexts';
import { Spinner } from '@components/base';
import { sortListByKey } from '@utils/sort';
import { styles } from './styles';
import { ListsGroups } from '@screens/Settings/screens/Watchlist/components/ListsOfAddressGroup';

export const Collections = () => {
  const { listsOfAddressGroup } = useLists((v) => v);
  const { refresh: refetchAddresses, addressesLoading } =
    useAllAddressesContext((v) => v);
  return (
    <View style={styles.main}>
      {addressesLoading ? (
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
          onRefresh={refetchAddresses}
        />
      )}
    </View>
  );
};
