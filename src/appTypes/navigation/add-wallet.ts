import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AddressStackParamsList = {
  WalletScreen: undefined;
  RestoreWalletScreen: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
};

export type AddWalletStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallet'>,
  NativeStackNavigationProp<AddressStackParamsList>
>;
