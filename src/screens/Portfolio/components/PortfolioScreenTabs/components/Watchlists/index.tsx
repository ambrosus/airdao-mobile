import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { AddressList } from '@components/templates';
import React from 'react';
import { scale } from '@utils/scaling';
import { useAllAddressesContext } from '@contexts';
import { Spinner } from '@components/base';
import { sortListByKey } from '@utils/sort';

export const WatchList = () => {
  const { watchlist } = useWatchlist();
  const { refresh: refetchAddresses, addressesLoading } =
    useAllAddressesContext((v) => v);

  return (
    <View style={{ paddingHorizontal: scale(16), flex: 1 }}>
      {addressesLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Spinner />
        </View>
      ) : (
        <AddressList
          isPortfolioFlow={true}
          emptyText=""
          data={sortListByKey(watchlist, 'ambBalance', 'desc')}
          contentContainerStyle={{ paddingBottom: '40%' }}
          onRefresh={refetchAddresses}
        />
      )}
    </View>
  );
};
