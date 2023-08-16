import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import { PortfolioStack } from './Tabs/PortfolioStack';
import TabBar from '@navigation/components/TabBar';
import SettingsStack from './Tabs/SettingsStack';
import WalletStack from './Tabs/WalletStack';
import SearchStack from './Tabs/SearchStack';
import HomeStack from './Tabs/HomeStack';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
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
        options={{ tabBarLabel: 'Overview' }}
      />
      <BottomTabs.Screen
        name="Portfolio"
        component={PortfolioStack}
        options={{ tabBarLabel: 'Watchlist' }}
      />
      <BottomTabs.Screen
        name="Search"
        component={SearchStack}
        options={{ tabBarLabel: 'Explore' }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: 'Settings' }}
      />
      <BottomTabs.Screen
        name="Wallet"
        component={WalletStack}
        options={{ tabBarLabel: 'Wallet' }}
      />
    </BottomTabs.Navigator>
  );
};
