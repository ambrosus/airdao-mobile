import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';

export const WithdrawRequests = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <Header title={t('harbor.requests.header')} />
      <Text>Requests</Text>
    </SafeAreaView>
  );
};
