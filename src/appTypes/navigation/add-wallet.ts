import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Wallet } from '@models/Wallet';

export type WalletStackParamsList = {
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  SuccessBackupComplete: undefined;
  ReceiptScreen: {
    amount: number;
    currencyCode: string;
    destination: string;
    origin: string;
    hash: string;
  };
  RestoreWalletScreen: undefined;
  WalletScreen: undefined;
  WalletAccount: { wallet: Wallet };
};

export type AddWalletStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallet'>,
  NativeStackNavigationProp<WalletStackParamsList>
>;
