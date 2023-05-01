import React from 'react';
import { WalletList } from '@components/templates';
import { useWatchlist } from '@hooks/cache';

export function Watchlists(): JSX.Element {
  const { watchlist } = useWatchlist();

  return (
    <WalletList
      title="Watchlists"
      emptyText="You haven't added an address to watchlist"
      totalAmount={watchlist.reduce((prev, curr) => prev + curr.ambBalance, 0)}
      data={watchlist}
    />
  );
}
