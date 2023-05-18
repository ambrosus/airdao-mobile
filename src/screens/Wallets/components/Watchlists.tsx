import React from 'react';
import { WalletList } from '@components/templates';
import { useWatchlist } from '@hooks';
import { View } from 'react-native';

export function Watchlists(): JSX.Element {
  const { watchlist } = useWatchlist();
  return (
    <View testID="watchlists">
      <WalletList
        title="Watchlists"
        emptyText="You haven't added an address to watchlist"
        totalAmount={watchlist.reduce(
          (prev, curr) => prev + curr.ambBalance,
          0
        )}
        data={watchlist}
      />
    </View>
  );
}
