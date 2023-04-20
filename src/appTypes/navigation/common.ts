import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

export type CommonStackParamsList = {
  Address: { address: ListsOfAddressType['addressId'] };
};

export type CommonStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<CommonStackParamsList>
>;
