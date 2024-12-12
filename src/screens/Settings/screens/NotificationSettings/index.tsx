import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '@components/composite';
import { NotificationSettingsView } from '@components/templates';

export const NotificationSettingsScreen = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <Header
        bottomBorder
        title={t('tab.notifications')}
        style={{ backgroundColor: 'transparent' }}
      />
      <NotificationSettingsView />
    </SafeAreaView>
  );
};
