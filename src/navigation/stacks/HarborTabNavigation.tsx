import React, { useCallback, useMemo } from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { HarborTabParamsList } from '@appTypes/navigation/tabs';
import { useKeyboardHeight } from '@hooks';
import { DeviceUtils } from '@utils/device';
import TabBar from '@navigation/components/TabBar';
import {
  BorrowHarborStacks,
  StakeAMBStacks,
  StakeHBRStacks
} from '@navigation/stacks/HarborStacks';

const BottomTabs = createBottomTabNavigator<HarborTabParamsList>();

export const HarborTabsNavigation = () => {
  const keyboardHeight = useKeyboardHeight();

  const renderTabBarComponent = useCallback(
    (props: BottomTabBarProps) =>
      DeviceUtils.isAndroid && keyboardHeight > 0 ? null : (
        <TabBar {...props} isHarbor />
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
      initialRouteName="StakeAMB"
      screenOptions={screenOptions}
      tabBar={renderTabBarComponent}
    >
      <BottomTabs.Screen name="StakeAMB" component={StakeAMBStacks} />
      <BottomTabs.Screen name="StakeHBR" component={StakeHBRStacks} />
      <BottomTabs.Screen name="BorrowHarbor" component={BorrowHarborStacks} />
    </BottomTabs.Navigator>
  );
};
