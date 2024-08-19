import {
  CompositeNavigationProp,
  NavigatorScreenParams
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PasscodeParams } from '@appTypes/navigation/passcode-params';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: NavigatorScreenParams<TabsParamsList>;
  WelcomeScreen: undefined;
  Passcode: PasscodeParams | undefined;
};

export type RootNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Wallets'>,
  NativeStackNavigationProp<RootStackParamsList>
>;
