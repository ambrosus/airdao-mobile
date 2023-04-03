import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ListsParamsLists = {
  ListsScreen: undefined;
};

export type ListsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Lists'>,
  NativeStackNavigationProp<ListsParamsLists>
>;
