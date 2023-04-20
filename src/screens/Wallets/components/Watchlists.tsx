import React from 'react';
import { WalletList } from '@components/templates';
import { useWatchlist } from '@hooks/cache';

export function Watchlists(): JSX.Element {
  const { watchlist } = useWatchlist();

  return (
    <WalletList
      title="Watchlists"
      totalAmount={watchlist.reduce((prev, curr) => prev + curr.ambBalance, 0)}
      data={watchlist}
    />
  );
}
