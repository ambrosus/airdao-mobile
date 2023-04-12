import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';

export type ExploreTabParamsList = {
  ExploreScreen: { address?: string } | undefined;
};

export type ExploreTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Explore'>,
  NativeStackNavigationProp<ExploreTabParamsList>
>;
