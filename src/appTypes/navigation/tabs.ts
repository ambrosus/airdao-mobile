import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { HomeParamsList, SettingsTabParamsList } from '@appTypes';

export type TabsParamsList = {
  Wallets: NavigatorScreenParams<HomeParamsList>;
  Products: NavigatorScreenParams<HomeParamsList>;
  Settings: NavigatorScreenParams<SettingsTabParamsList>;
  Tabs: {
    screen: string;
    params: {
      screen: 'CreateWalletStep0' | 'ImportWalletMethods';
      params: { from: string };
    };
  };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
