import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonStackParamsList } from './common';
import { TabsParamsList } from './tabs';

export type SearchTabParamsList = {
  Explore: Partial<{ address: string }>;
} & CommonStackParamsList;

export type SearchTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<SearchTabParamsList>
>;
