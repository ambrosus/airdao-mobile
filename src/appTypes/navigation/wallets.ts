import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from './tabs';
import { CommonStackParamsList } from './common';
import { StakingPool, Token } from '@models';
import { MarketType } from '@features/kosmos/types';

export type HomeParamsList = {
  HomeScreen: undefined;
  AMBMarketScreen: undefined;
  Notifications: undefined;
  NFTScreen: {
    tokenInfo: Token;
    walletAccount: string;
  };
  AssetScreen: {
    tokenInfo: Token;
    walletAccount: string;
  };
  SendFunds: { token?: Token };
  StakingPool: { pool: StakingPool };
  StakingPools: undefined;
  Bridge: undefined;
  BridgeHistory: undefined;
  BridgeTransferError: undefined;
  SuccessSetupSecurity: undefined;
  StakeSuccessScreen: {
    type: 'stake' | 'withdraw';
    walletAddress: string | null;
  };
  StakeErrorScreen: undefined;
  KosmosScreen: undefined;
  KosmosMarketScreen: { market: MarketType };
  SwapScreen: undefined;
  SwapSettingsScreen: undefined;
  AddressSearch: {
    address: string;
  };
  Wallets: { screen: string };
  Harbor: undefined;
} & CommonStackParamsList;

export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList>,
  NativeStackNavigationProp<HomeParamsList>
>;
