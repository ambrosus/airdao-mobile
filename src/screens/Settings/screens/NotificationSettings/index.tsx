import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
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
