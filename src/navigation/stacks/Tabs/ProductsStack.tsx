import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsParams } from '@appTypes/navigation/products';
import { HarborStacks } from '@navigation/stacks/HarborStacks/HarborStacks';
import { Bridge, BridgeTransferError } from '@screens/Bridge';
import { BridgeHistory } from '@screens/BridgeHistory';
import { KosmosScreen } from '@screens/Kosmos';
import { KosmosMarketScreen } from '@screens/Kosmos/screens';
import { ProductScreen } from '@screens/Products';
import { StakingPoolScreen } from '@screens/StakingPool';
import {
  StakeErrorScreen,
  StakeSuccessScreen
} from '@screens/StakingPool/screens';
import { StakingPoolsScreen } from '@screens/StakingPools';
import { SwapScreen } from '@screens/Swap';
import { SwapSettingsScreen } from '@screens/Swap/screens';
import { getCommonStack } from '../CommonStack';

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

      {/* HARBOR ROUTES */}
      <Stack.Screen name="Harbor" component={HarborStacks} />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default ProductsStack;
