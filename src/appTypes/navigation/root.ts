import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: NavigatorScreenParams<TabsParamsList>;
  WelcomeScreen: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamsList>;
