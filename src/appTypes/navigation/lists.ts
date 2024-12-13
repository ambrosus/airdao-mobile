import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonStackParamsList } from './common';

export type PortfolioParamsPortfolio = {
  PortfolioScreen: { tabs: { activeTab: number } };
} & CommonStackParamsList;

export type PortfolioNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<PortfolioParamsPortfolio>
>;
