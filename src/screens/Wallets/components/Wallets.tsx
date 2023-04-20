import React from 'react';
import { WalletList } from '@components/templates';
import { usePersonalList } from '@hooks/cache';

export function Wallets(): JSX.Element {
  const { personalList } = usePersonalList();

  return (
    <WalletList
      title="My Wallets"
      totalAmount={personalList.reduce(
        (prev, curr) => prev + curr.ambBalance,
        0
      )}
      data={personalList}
    />
  );
}
