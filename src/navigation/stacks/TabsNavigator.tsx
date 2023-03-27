import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListsStack from './Tabs/ListsStack';
import SettingsStack from './Tabs/SettingsStack';
import ExploreStack from './Tabs/ExploreStack';
import WalletsStack from './Tabs/WalletsStack';

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
    <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
      <BottomTabs.Screen
        name="Wallets"
        component={WalletsStack}
        // options={{ tabBarIcon: WalletsIcon }}
      />
      <BottomTabs.Screen
        name="Explore"
        component={ExploreStack}
        // options={{ tabBarIcon: ExploreIcon }}
      />
      <BottomTabs.Screen
        name="Lists"
        component={ListsStack}
        // options={{ tabBarIcon: ListsIcon }}
      />
      <BottomTabs.Screen
        name="Settings"
        component={SettingsStack}
        // options={{ tabBarIcon: SettingsIcon }}
      />
    </BottomTabs.Navigator>
  );
};
