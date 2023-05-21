import React from 'react';
import { useWatchlist } from '@hooks';
import { View } from 'react-native';
import { RenderItem } from '@components/templates/WalletList/components/RenderItem';

export const HomeWatchlists = () => {
  const { watchlist } = useWatchlist();
  return (
    <View style={{ paddingHorizontal: 24 }}>
      {watchlist.slice(0, 4).map((item, index) => {
        return (
          <View key={index}>
            <RenderItem item={item} idx={index} isPortfolioFlow={false} />
          </View>
        );
      })}
    </View>
  );
};
