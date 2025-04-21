import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CryptoCurrencyCode, TabsParamsList } from '@appTypes';
import { IAvailableWithdrawLogs } from '@entities/harbor/types';

export type HarborTabParamsList = {
  StakeHarborScreen: undefined;
  WithdrawHarborScreen: undefined;
  WithdrawHarborPoolScreen: {
    token: CryptoCurrencyCode.ASC | CryptoCurrencyCode.HBR;
    logs: IAvailableWithdrawLogs | null;
  };
  WithdrawRequests: undefined;
  ProcessStake: undefined;
  StakeHBRScreen: undefined;
  StakeAMBScreen: { apy?: number };
};

export type HarborNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HarborTabParamsList>
>;
