import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';

export type ExploreTabParamsList = {
  ExploreScreen: { address?: string } | undefined;
} & CommonStackParamsList;

export type ExploreTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Explore'>,
  NativeStackNavigationProp<ExploreTabParamsList>
>;
