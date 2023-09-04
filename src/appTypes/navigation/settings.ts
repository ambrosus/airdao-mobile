import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from './tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type SettingsTabParamsList = {
  SettingsScreen: undefined;
};

export type SettingsTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Settings'>,
  NativeStackNavigationProp<SettingsTabParamsList>
>;
