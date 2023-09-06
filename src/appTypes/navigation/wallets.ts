import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';
import { Wallet } from '@models';

export type HomeParamsList = {
  HomeScreen: undefined;
  AMBMarketScreen: undefined;
  Notifications: undefined;
  AssetScreen: {
    tokenInfo: {
      name: string;
      address: string;
      balance: { wei: string; ether: number };
    };
    walletAccount: string;
  };
  SendFunds: undefined;
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  SuccessBackupComplete: undefined;
  SuccessImport: undefined;
  SuccessSetupSecurity: undefined;
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
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<HomeParamsList>
>;
