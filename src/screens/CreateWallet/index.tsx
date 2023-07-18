import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { styles } from './styles';

export const CreateWalletScreen = () => {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header title="Create Wallet" />
    </SafeAreaView>
  );
};
