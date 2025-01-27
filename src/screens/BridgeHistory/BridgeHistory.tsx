import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { BridgeHistoryTransactions } from '@features/bridge/templates/BridgeHistory/BridgeHistory.Transactions';

export const BridgeHistory = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Header
        closeIconVisible={true}
        title={t('bridge.history.heading')}
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
