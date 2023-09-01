import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';

export type HomeParamsList = {
  HomeScreen: undefined;
  AMBMarketScreen: undefined;
  Notifications: undefined;
  SendFunds: undefined;
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<HomeParamsList>
>;
