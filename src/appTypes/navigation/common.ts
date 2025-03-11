import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { AccountList } from '@models';
import { PasscodeParams } from './passcode-params';
import { TabsParamsList } from './tabs';

export type CommonStackParamsList = {
  Address: { address: ListsOfAddressType['addressId'] };
  Passcode: PasscodeParams;
  Collection: { group: AccountList };
  Explore: { address: string };
  BrowserScreen: { uri: string };
};

export type CommonStackNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<CommonStackParamsList>
>;
