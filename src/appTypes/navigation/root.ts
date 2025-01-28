import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PasscodeParams } from '@appTypes/navigation/passcode-params';
import { TabsParamsList } from './tabs';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: NavigatorScreenParams<TabsParamsList>;
  WelcomeScreen: undefined;
  Passcode: PasscodeParams | undefined;
  BarcodeScannerScreen: {
    onScanned: (data: string) => void;
    walletConnectEnabled?: boolean;
  };
};

export type RootNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<RootStackParamsList>
>;
