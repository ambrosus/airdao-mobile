import { NavigatorScreenParams } from '@react-navigation/native';
import { ExploreTabParamsList } from './explore';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type TabsParamsList = {
  Wallets: undefined;
  Explore: NavigatorScreenParams<ExploreTabParamsList>;
  Lists: undefined;
  Settings: undefined;
  Tabs: { screen: string };
};

export type TabsNavigationProp = BottomTabNavigationProp<TabsParamsList>;
