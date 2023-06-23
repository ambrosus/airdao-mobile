import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioStack } from './Tabs/PortfolioStack';
import SettingsStack from './Tabs/SettingsStack';
import SearchStack from './Tabs/SearchStack';
import HomeStack from './Tabs/HomeStack';
import TabBar from '@navigation/components/TabBar';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { useCurrentRoute } from '@contexts';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
  const { top } = useSafeAreaInsets();
  const currentRoute = useCurrentRoute();

  return (
    <View
      style={{
        height: '100%',
        paddingTop: top,
        backgroundColor:
          currentRoute === 'HomeScreen' ? '#f3f5f7' : COLORS.white
      }}
    >
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
          options={{ tabBarLabel: 'Home' }}
        />
        <BottomTabs.Screen name="Portfolio" component={PortfolioStack} />
        <BottomTabs.Screen name="Search" component={SearchStack} />
        <BottomTabs.Screen name="Settings" component={SettingsStack} />
      </BottomTabs.Navigator>
    </View>
  );
};
