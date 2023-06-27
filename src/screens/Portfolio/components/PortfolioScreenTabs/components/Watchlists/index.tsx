import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { WalletList } from '@components/templates';
import React from 'react';
import { scale } from '@utils/scaling';

export const WatchList = () => {
  const { watchlist } = useWatchlist();

  return (
    <View style={{ paddingHorizontal: scale(16), flex: 1 }}>
      <WalletList isPortfolioFlow={true} emptyText="" data={watchlist} />
    </View>
  );
};
