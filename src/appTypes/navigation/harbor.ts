import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from '@appTypes';

export type HarborTabParamsList = {
  StakeHarborScreen: undefined;
  WithdrawHarborScreen: undefined;
  WithdrawRequests: undefined;
  ProcessStake: undefined;
  StakeHBRScreen: undefined;
  StakeAMBScreen: { apy?: number };
};

export type HarborNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HarborTabParamsList>
>;
