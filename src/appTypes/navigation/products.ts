import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StakingPool } from '@models';
import { CommonStackParamsList, TabsParamsList } from '@appTypes';
import { MarketType } from '@features/kosmos/types';

export type ProductsParams = {
  ProductsScreen: undefined;
  // Swap
  SwapScreen: undefined;
  SwapSettingsScreen: undefined;

  // Stake
  StakingPools: undefined;
  StakingPool: { pool: StakingPool };
  StakeErrorScreen: undefined;
  StakeSuccessScreen: {
    type: 'stake' | 'withdraw';
    walletAddress: string | null;
  };

  // Kosmos
  KosmosScreen: undefined;
  KosmosMarketScreen: { market: MarketType };

  // Bridge
  Bridge: undefined;
  BridgeHistory: undefined;
  BridgeTransferError: undefined;
  Harbor: undefined;
} & CommonStackParamsList;

export type PortfolioNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Products'>,
  NativeStackNavigationProp<ProductsParams>
>;
