import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
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

export type HarborTabParamsList = {
  HarborTabsNavigation: undefined;
  StakeAMB: undefined;
  StakeHBR: undefined;
  BorrowHarbor: undefined;
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
