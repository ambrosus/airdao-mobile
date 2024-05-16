import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalletDBModel } from '@database';
import { TabsParamsList } from './tabs';
import { PasscodeModel } from './passcode';

export type SettingsTabParamsList = {
  About: undefined;
  AppPreferences: undefined;
  HelpCenter: undefined;
  ManageWallets: undefined;
  NotificationSettings: undefined;
  SecuritySettings: undefined;
  ChangePasscode: undefined;
  SettingsScreen: undefined;
  SingleWallet: { wallet: WalletDBModel };
  RecoveryPhrase: { walletHash: string };
  Passcode: PasscodeModel;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;
