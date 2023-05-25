import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { WalletList } from '@components/templates';
import React from 'react';

export const WatchList = () => {
  const { watchlist } = useWatchlist();

  return (
    <View style={{ paddingHorizontal: 17 }} testID="Watchlist">
      <WalletList
        isListOpened={true}
        isPortfolioFlow={true}
        emptyText=""
        totalAmount={watchlist.reduce(
          (prev, curr) => prev + curr.ambBalance,
          0
        )}
        data={watchlist}
      />
    </View>
  );
};
