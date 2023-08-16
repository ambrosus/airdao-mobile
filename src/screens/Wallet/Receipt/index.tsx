import { WalletStackParamsList } from '@appTypes';
import { Header } from '@components/composite';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView } from 'react-native';

export const ReceiptScreen = () => {
  const route = useRoute<RouteProp<WalletStackParamsList, 'ReceiptScreen'>>();
  const { amount, currencyCode, destination } = route.params;

  return (
    <SafeAreaView>
      <Header title="Receipt" />
    </SafeAreaView>
  );
};
