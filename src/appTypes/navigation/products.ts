import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonStackParamsList, TabsParamsList } from '@appTypes';
import { StakingPool } from '@models';

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
