import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAllWallets } from '@hooks/database';

export const ManageWalletsScreen = () => {
  const { data: allWallets, loading } = useAllWallets();

  return (
    <SafeAreaView>
      {/* <FlatList
        data={allWallets}
        keyExtractor={(wallet) => wallet.hash}
        renderItem={renderWallet}
      /> */}
    </SafeAreaView>
  );
};
