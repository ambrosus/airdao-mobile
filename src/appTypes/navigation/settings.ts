import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalletDBModel } from '@database';
import { TabsParamsList } from './tabs';
import { PasscodeParams } from './passcode-params';

export type SettingsTabParamsList = {
  About: undefined;
  AppPreferences: undefined;
  HelpCenter: undefined;
  ManageWallets: undefined;
  NotificationSettings: undefined;
  SecuritySettings: undefined;
  ChangePasscode: undefined;
  SettingsScreen: undefined;
  SingleWallet: { wallet: WalletDBModel; walletAddress: string };
  AccessKeys: { walletHash: string };
  CreateWalletStep0: undefined;
  CreateWalletStep1: undefined;
  CreateWalletStep2: undefined;
  Passcode: PasscodeParams;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;
