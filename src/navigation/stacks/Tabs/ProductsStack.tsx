import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getCommonStack } from '../CommonStack';
import { ProductsParams } from '@appTypes/navigation/products';
import { ProductScreen } from '@screens/Products';
import { SwapScreen } from '@screens/Swap';
import { StakingPoolsScreen } from '@screens/StakingPools';
import { KosmosScreen } from '@screens/Kosmos';
import { Bridge, BridgeTransferError } from '@screens/Bridge';
import { StakingPoolScreen } from '@screens/StakingPool';
import {
  StakeErrorScreen,
  StakeSuccessScreen
} from '@screens/StakingPool/screens';
import { KosmosMarketScreen } from '@screens/Kosmos/screens';
import { BridgeHistory } from '@screens/BridgeHistory';
import {
  SwapSuccessScreen,
  SwapErrorScreen,
  SwapSettingsScreen
} from '@screens/Swap/screens';

const Stack = createNativeStackNavigator<ProductsParams>();
export const ProductsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ProductsScreen"
    >
      <Stack.Screen
        name="ProductsScreen"
        component={ProductScreen}
        options={{ headerShown: false }}
      />
      {/* SWAP ROUTES */}
      <Stack.Screen name="SwapScreen" component={SwapScreen} />
      <Stack.Screen name="SwapSuccessScreen" component={SwapSuccessScreen} />
      <Stack.Screen name="SwapErrorScreen" component={SwapErrorScreen} />
      <Stack.Screen name="SwapSettingsScreen" component={SwapSettingsScreen} />

      {/* STAKE ROUTES */}
      <Stack.Screen name="StakingPools" component={StakingPoolsScreen} />
      <Stack.Screen name="StakingPool" component={StakingPoolScreen} />
      <Stack.Screen name="StakeSuccessScreen" component={StakeSuccessScreen} />
      <Stack.Screen name="StakeErrorScreen" component={StakeErrorScreen} />

      {/* KOSMOS ROUTES */}
      <Stack.Screen name="KosmosScreen" component={KosmosScreen} />
      <Stack.Screen name="KosmosMarketScreen" component={KosmosMarketScreen} />

      {/* BRIDGE ROUTES */}
      <Stack.Screen name="Bridge" component={Bridge} />
      <Stack.Screen
        name="BridgeTransferError"
        component={BridgeTransferError}
      />
      <Stack.Screen
        name="BridgeHistory"
        options={{
          presentation: 'fullScreenModal'
        }}
        component={BridgeHistory}
      />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default ProductsStack;
