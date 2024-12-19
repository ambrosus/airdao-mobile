import React from 'react';
import { View } from 'react-native';
import { Spinner } from '@components/base';
import { AddressList } from '@components/templates';
import { useAddressesStore, useFetchAddresses } from '@entities/addresses';
import { useWatchlist } from '@hooks';
import { sortListByKey } from '@utils';
import { styles } from './styles';

export const WatchList = () => {
  const { watchlist } = useWatchlist();
  const { loading } = useAddressesStore();
  const { refetch: refetchAddresses } = useFetchAddresses();

  return (
    <View style={styles.main}>
      {loading ? (
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
