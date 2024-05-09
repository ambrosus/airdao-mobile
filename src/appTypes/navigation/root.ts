import {
  CompositeNavigationProp,
  NavigatorScreenParams
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PasscodeModel } from '@appTypes/navigation/Passcode';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: NavigatorScreenParams<TabsParamsList>;
  WelcomeScreen: undefined;
  Passcode: PasscodeModel;
};

export type RootNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<RootStackParamsList>
>;
