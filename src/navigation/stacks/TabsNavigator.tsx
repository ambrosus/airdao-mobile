import React from 'react';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import TabBar from '@navigation/components/TabBar';
import { usePasscodeEntryRevealer } from '@hooks';
import { PortfolioStack } from './Tabs/PortfolioStack';
import SettingsStack from './Tabs/SettingsStack';
import SearchStack from './Tabs/SearchStack';
import HomeStack from './Tabs/HomeStack';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
  usePasscodeEntryRevealer();
  const { t } = useTranslation();

  return (
    <BottomTabs.Navigator
      initialRouteName="Wallets"
      screenOptions={{
        headerShown: false
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTabs.Screen
        name="Wallets"
        component={HomeStack}
        options={{ tabBarLabel: t('tab.wallets') }}
      />
      <BottomTabs.Screen
        name="Portfolio"
        component={PortfolioStack}
        options={{ tabBarLabel: t('tab.watchlist') }}
      />
      <BottomTabs.Screen
        name="Search"
        component={SearchStack}
        options={{ tabBarLabel: t('tab.explore') }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: t('tab.settings') }}
      />
    </BottomTabs.Navigator>
  );
};
