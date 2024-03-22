import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { AddressList } from '@components/templates';
import React from 'react';
import { useAllAddressesContext } from '@contexts';
import { Spinner } from '@components/base';
import { sortListByKey } from '@utils/sort';
import { styles } from './styles';

export const WatchList = () => {
  const { watchlist } = useWatchlist();
  const { refresh: refetchAddresses, addressesLoading } =
    useAllAddressesContext((v) => v);

  return (
    <View style={styles.main}>
      {addressesLoading ? (
        <View style={styles.addressesWrapper}>
          <Spinner />
        </View>
      ) : (
        <AddressList
          isPortfolioFlow={true}
          emptyText=""
          data={sortListByKey(watchlist, 'ambBalance', 'desc')}
          contentContainerStyle={styles.addressesList}
          onRefresh={refetchAddresses}
        />
      )}
    </View>
  );
};
