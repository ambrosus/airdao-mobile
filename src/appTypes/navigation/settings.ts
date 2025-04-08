import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalletDBModel } from '@database';
import { AccountList } from '@models';
import { PasscodeParams } from './passcode-params';
import { TabsParamsList } from './tabs';

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
  CreateWalletStep0: { from?: string };
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  Passcode: PasscodeParams;
  ImportWalletMethods: { from?: string };
  ImportWallet: undefined;
  ImportWalletPrivateKey: undefined;
  SetupPasscode: undefined;
  ConfirmPasscode: { passcode: string[] };
  SuccessSetupSecurity: undefined;
  WelcomeScreen: undefined;
  Collection: { group: AccountList };
  ManagePermissions: undefined;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;
