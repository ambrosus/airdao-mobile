import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { styles } from './ManageWallets.styles';
import { Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import { AllWallets } from './components';

export const ManageWalletsScreen = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t('settings.manage.wallet')}
        style={{ shadowColor: COLORS.transparent }}
      />
      <AllWallets />
    </SafeAreaView>
  );
};
