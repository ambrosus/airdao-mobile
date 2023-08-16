import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Wallet } from '@models/Wallet';

export type WalletStackParamsList = {
  WalletScreen: undefined;
  WalletAccount: { wallet: Wallet };
  RestoreWalletScreen: undefined;
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
};

export type AddWalletStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallet'>,
  NativeStackNavigationProp<WalletStackParamsList>
>;
