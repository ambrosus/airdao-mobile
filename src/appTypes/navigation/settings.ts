import {
  CompositeNavigationProp,
  NavigatorScreenParams
} from '@react-navigation/native';
import { AddWalletStackParamsList } from './add-wallet';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type SettingsTabParamsList = {
  SettingsScreen: undefined;
  AddWalletStack: NavigatorScreenParams<AddWalletStackParamsList>;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;