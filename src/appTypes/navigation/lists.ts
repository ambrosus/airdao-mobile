import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsTabParamsList } from '@appTypes';
import { CommonStackParamsList } from './common';

export type PortfolioParamsPortfolio = {
  PortfolioScreen: { tabs: { activeTab: number } };
} & CommonStackParamsList;

export type PortfolioNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<SettingsTabParamsList, 'Watchlist'>,
  NativeStackNavigationProp<PortfolioParamsPortfolio>
>;
