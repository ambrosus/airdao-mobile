import React from 'react';
import { WalletList } from '@components/templates';
import { useWatchlist } from '@hooks/cache';

export function Watchlists(): JSX.Element {
  const { watchlist } = useWatchlist();

  return (
    <WalletList title="Watchlists" totalAmount={1200000} data={watchlist} />
  );
}
