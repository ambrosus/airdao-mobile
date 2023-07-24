import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { WalletList } from '@components/templates';
import React from 'react';
import { scale } from '@utils/scaling';
import { useAllAddressesContext } from '@contexts';
import { Spinner } from '@components/base';

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
        <WalletList
          isPortfolioFlow={true}
          emptyText=""
          data={watchlist}
          contentContainerStyle={{ paddingBottom: '40%' }}
          onRefresh={refetchAddresses}
        />
      )}
    </View>
  );
};
