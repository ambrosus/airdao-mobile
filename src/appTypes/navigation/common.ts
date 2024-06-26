import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { AccountList } from '@models';
import { PasscodeModel } from './passcode';

export type CommonStackParamsList = {
  Address: { address: ListsOfAddressType['addressId'] };
  Passcode: PasscodeModel;
  Collection: { group: AccountList };
};

export type CommonStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<CommonStackParamsList>
>;
