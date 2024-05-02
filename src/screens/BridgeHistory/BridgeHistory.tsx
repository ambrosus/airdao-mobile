import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { BridgeHistoryTransactions } from '@components/templates/Bridge/BridgeHistory/BridgeHistory.Transactions';

export const BridgeHistory = () => {
  return (
    <SafeAreaView>
      <Header
        closeIconVisible={true}
        title="Transaction history"
        backIconVisible={false}
        style={{ shadowColor: 'transparent' }}
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: COLORS.neutral900Alpha['5'],
          marginBottom: 15
        }}
      />
      <BridgeHistoryTransactions />
    </SafeAreaView>
  );
};
