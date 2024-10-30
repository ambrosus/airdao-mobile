import { CommonStackParamsList, TabsParamsList } from '@appTypes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type ProductsParams = {
  ProductsScreen: { tabs: { activeTab: number } };
  SwapScreen: undefined;
  StakingPools: undefined;
  Bridge: undefined;
  KosmosScreen: undefined;
} & CommonStackParamsList;

export type PortfolioNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamsList, 'Products'>,
  NativeStackNavigationProp<ProductsParams>
>;
