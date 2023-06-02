import { NavigatorScreenParams } from '@react-navigation/native';
import { SearchTabParamsList } from './search';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type TabsParamsList = {
  Wallets: undefined;
  Search: NavigatorScreenParams<SearchTabParamsList>;
  Portfolio: undefined;
  Settings: undefined;
  Tabs: { screen: string };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
