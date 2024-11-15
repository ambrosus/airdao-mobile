import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeParamsList } from '@appTypes';

export type TabsParamsList = {
  Wallets: NavigatorScreenParams<HomeParamsList>;
  Products: NavigatorScreenParams<HomeParamsList>;
  Settings: { Explore: undefined; Watchlist: undefined };
  Tabs: { screen: string };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
