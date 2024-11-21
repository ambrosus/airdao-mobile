import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalletDBModel } from '@database';
import { TabsParamsList } from './tabs';
import { PasscodeParams } from './passcode-params';

export type SettingsTabParamsList = {
  About: undefined;
  AppPreferences: undefined;
  Explore: undefined;
  HelpCenter: undefined;
  ManageWallets: undefined;
  Address: { address: string };
  NotificationSettings: undefined;
  SecuritySettings: undefined;
  ChangePasscode: undefined;
  SettingsScreen: undefined;
  Watchlist: undefined;
  SingleWallet: { wallet: WalletDBModel; walletAddress: string };
  AccessKeys: { walletHash: string };
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  Passcode: PasscodeParams;
  ImportWalletMethods: undefined;
  ImportWallet: undefined;
  ImportWalletPrivateKey: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  SuccessSetupSecurity: undefined;
  WelcomeScreen: undefined;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;
