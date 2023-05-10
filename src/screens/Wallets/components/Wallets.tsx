import React from 'react';
import { WalletList } from '@components/templates';
import { usePersonalList } from '@hooks';
import { View } from 'react-native';

export function Wallets(): JSX.Element {
  const { personalList } = usePersonalList();

  return (
    <View testID="wallets-list">
      <WalletList
        title="My Wallets"
        emptyText="You haven't added a personal address yet"
        totalAmount={personalList.reduce(
          (prev, curr) => prev + curr.ambBalance,
          0
        )}
        data={personalList}
      />
    </View>
  );
}
