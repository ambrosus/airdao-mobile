import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';
import { TokenDTO } from '@models';

export type HomeParamsList = {
  HomeScreen: undefined;
  AMBMarketScreen: undefined;
  Notifications: undefined;
  AssetScreen: {
    tokenInfo: TokenDTO;
    walletAccount: string;
  };
  SendFunds: undefined;
  SendFundsStatus: undefined;
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  CreateWalletSuccess: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  SuccessSetupSecurity: undefined;
  ImportWallet: undefined;
  ImportWalletSuccess: undefined;
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<HomeParamsList>
>;
