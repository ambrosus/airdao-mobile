import React from 'react';
import { Header } from '@components/composite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export const WithdrawRequests = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <Header title={t('harbor.requests.header')} />
      <Text>Requests</Text>
    </SafeAreaView>
  );
};
