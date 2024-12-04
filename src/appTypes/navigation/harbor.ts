import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabsParamsList } from '@appTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HarborTabParamsList = {
  StakeHarborScreen: undefined;
  WithdrawHarborScreen: undefined;
  WithdrawRequests: undefined;
};

export type HarborNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HarborTabParamsList>
>;
