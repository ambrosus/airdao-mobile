import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { WalletList } from '@components/templates';
import React from 'react';
import { scale } from '@utils/scaling';

export const WatchList = () => {
  const { watchlist } = useWatchlist();

  return (
    <View style={{ paddingHorizontal: scale(16) }}>
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
