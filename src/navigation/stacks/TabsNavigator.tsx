import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioStack } from './Tabs/PortfolioStack';
import SettingsStack from './Tabs/SettingsStack';
import SearchStack from './Tabs/SearchStack';
import HomeStack from './Tabs/HomeStack';
import TabBar from '@navigation/components/TabBar';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import { useTranslation } from 'react-i18next';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
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
        options={{ tabBarLabel: t('overview.tab') }}
      />
      <BottomTabs.Screen
        name="Portfolio"
        component={PortfolioStack}
        options={{ tabBarLabel: t('watchlist.tab') }}
      />
      <BottomTabs.Screen
        name="Search"
        component={SearchStack}
        options={{ tabBarLabel: t('explore.tab') }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: t('settings.tab') }}
      />
    </BottomTabs.Navigator>
  );
};
