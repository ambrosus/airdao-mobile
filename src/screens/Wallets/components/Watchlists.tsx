import React from 'react';
import { WalletList } from '@components/templates';
import { useWatchlist } from '@hooks';
import { View } from 'react-native';

export function Watchlists(): JSX.Element {
  const { watchlist } = useWatchlist();
  return (
    <View testID="Watchlists">
      <WalletList data={watchlist} />
    </View>
  );
}
