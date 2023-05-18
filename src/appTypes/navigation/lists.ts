import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonStackParamsList } from './common';
import { AccountList } from '@models/AccountList';

export type PortfolioParamsPortfolio = {
  PortfolioScreen: undefined;
  SingleAddressGroup: { group: AccountList };
} & CommonStackParamsList;

export type PortfolioNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Portfolio'>,
  NativeStackNavigationProp<PortfolioParamsPortfolio>
>;
