import React, { useCallback, useMemo } from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import TabBar from '@navigation/components/TabBar';
import { useKeyboardHeight, usePasscodeEntryRevealer } from '@hooks';
import SettingsStack from './Tabs/SettingsStack';
import HomeStack from './Tabs/HomeStack';
import { ProductScreen } from '@screens/Products';
import { DeviceUtils } from '@utils/device';

const BottomTabs = createBottomTabNavigator<TabsParamsList>();

export const TabsNavigator = () => {
  usePasscodeEntryRevealer();
  const keyboardHeight = useKeyboardHeight();

  const renderTabBarComponent = useCallback(
    (props: BottomTabBarProps) =>
      DeviceUtils.isAndroid && keyboardHeight > 0 ? null : (
        <TabBar {...props} />
      ),
    [keyboardHeight]
  );

  const screenOptions: BottomTabNavigationOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarStyle: { display: keyboardHeight > 0 ? 'none' : 'flex' }
    }),
    [keyboardHeight]
  );

  return (
    <BottomTabs.Navigator
      initialRouteName="Wallets"
      screenOptions={screenOptions}
      tabBar={renderTabBarComponent}
    >
      <BottomTabs.Screen name="Wallets" component={HomeStack} />
      <BottomTabs.Screen name="Products" component={ProductScreen} />
      <BottomTabs.Screen name="Settings" component={SettingsStack} />
    </BottomTabs.Navigator>
  );
};
