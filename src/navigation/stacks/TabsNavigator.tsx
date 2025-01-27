import { useCallback, useMemo } from 'react';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes/navigation/tabs';
import { WalletConnectModal } from '@features/wallet-connect/components/templates';
import { useKeyboardHeight, usePasscodeEntryRevealer } from '@hooks';
import TabBar from '@navigation/components/TabBar';
import { DeviceUtils } from '@utils';
import HomeStack from './Tabs/HomeStack';
import ProductsStack from './Tabs/ProductsStack';
import SettingsStack from './Tabs/SettingsStack';

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
    <>
      <BottomTabs.Navigator
        initialRouteName="Wallets"
        screenOptions={screenOptions}
        tabBar={renderTabBarComponent}
      >
        <BottomTabs.Screen name="Wallets" component={HomeStack} />
        <BottomTabs.Screen name="Products" component={ProductsStack} />
        <BottomTabs.Screen name="Settings" component={SettingsStack} />
      </BottomTabs.Navigator>
      <WalletConnectModal />
    </>
  );
};
