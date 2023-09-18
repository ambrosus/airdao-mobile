import { NavigatorScreenParams } from '@react-navigation/native';
import { SearchTabParamsList } from './search';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeParamsList, PortfolioParamsPortfolio } from '@appTypes';

export type TabsParamsList = {
  Wallets: NavigatorScreenParams<HomeParamsList>;
  Search: NavigatorScreenParams<SearchTabParamsList>;
  Portfolio: NavigatorScreenParams<PortfolioParamsPortfolio>;
  Settings: undefined;
  Tabs: { screen: string };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
