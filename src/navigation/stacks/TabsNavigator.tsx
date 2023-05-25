import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioStack } from './Tabs/PortfolioStack';
import SettingsStack from './Tabs/SettingsStack';
import ExploreStack from './Tabs/ExploreStack';
import HomeStack from './Tabs/HomeStack';
import TabBar from '@navigation/components/TabBar';
import { TabsParamsList } from '@appTypes/navigation/tabs';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTabs.Screen
        name="Wallets"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <BottomTabs.Screen name="Portfolio" component={PortfolioStack} />
      <BottomTabs.Screen name="Explore" component={ExploreStack} />
      <BottomTabs.Screen name="Settings" component={SettingsStack} />
    </BottomTabs.Navigator>
  );
};
