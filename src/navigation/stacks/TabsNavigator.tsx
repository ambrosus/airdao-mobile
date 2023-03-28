import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListsStack from './Tabs/ListsStack';
import SettingsStack from './Tabs/SettingsStack';
import ExploreStack from './Tabs/ExploreStack';
import WalletsStack from './Tabs/WalletsStack';
import TabBar from '@navigation/components/TabBar';

export type TabsParamsList = {
  Wallets: undefined;
  Explore: undefined;
  Lists: undefined;
  Settings: undefined;
  Tabs: { screen: string };
};

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTabs.Screen name="Wallets" component={WalletsStack} />
      <BottomTabs.Screen name="Explore" component={ExploreStack} />
      <BottomTabs.Screen name="Lists" component={ListsStack} />
      <BottomTabs.Screen name="Settings" component={SettingsStack} />
    </BottomTabs.Navigator>
  );
};
