import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonStackParamsList } from './common';

export type ListsParamsLists = {
  ListsScreen: undefined;
} & CommonStackParamsList;

export type ListsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Lists'>,
  NativeStackNavigationProp<ListsParamsLists>
>;
