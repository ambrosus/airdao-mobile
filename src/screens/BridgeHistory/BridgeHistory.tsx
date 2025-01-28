import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { BridgeHistoryTransactions } from '@features/bridge/templates/BridgeHistory/BridgeHistory.Transactions';
import { styles } from './styles';

export const BridgeHistory = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Header
        closeIconVisible={true}
        title={t('bridge.history.heading')}
        backIconVisible={false}
        style={styles.header}
      />
      <View style={styles.container} />
      <BridgeHistoryTransactions />
    </SafeAreaView>
  );
};
