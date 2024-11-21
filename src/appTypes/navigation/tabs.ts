import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeParamsList, SettingsTabParamsList } from '@appTypes';

export type TabsParamsList = {
  Wallets: NavigatorScreenParams<HomeParamsList>;
  Products: NavigatorScreenParams<HomeParamsList>;
  Settings: NavigatorScreenParams<SettingsTabParamsList>;
  Tabs: { params: { screen: string } } | { screen: string };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
