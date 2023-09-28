import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';

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
  SendFundsLoading: undefined;
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  SuccessSetupSecurity: undefined;
  SuccessBackupComplete: undefined;
  SuccessImport: undefined;
  RestoreWalletScreen: undefined;
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<HomeParamsList>
>;
