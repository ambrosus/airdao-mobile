import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { WalletList } from '@components/templates';
import React from 'react';
import { scale } from '@utils/scaling';
import { useAllAddressesContext } from '@contexts';

export const WatchList = () => {
  const { watchlist } = useWatchlist();
  const { refresh: refetchAddresses } = useAllAddressesContext((v) => v);

  return (
    <View style={{ paddingHorizontal: scale(16), flex: 1 }}>
      <WalletList
        isPortfolioFlow={true}
        emptyText=""
        data={watchlist}
        contentContainerStyle={{ paddingBottom: '40%' }}
        onRefresh={refetchAddresses}
      />
    </View>
  );
};
