import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AddWalletStackParamsList = {
  AddWalletScreen: undefined;
  RestoreWalletScreen: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
};

export type AddWalletStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<AddWalletStackParamsList>
>;
