import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getCommonStack } from '../CommonStack';
import { ProductsParams } from '@appTypes/navigation/products';
import { ProductScreen } from '@screens/Products';
import { SwapScreen } from '@screens/Swap';
import { StakingPoolsScreen } from '@screens/StakingPools';
import { KosmosScreen } from '@screens/Kosmos';
import { Bridge } from '@screens/Bridge';

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
      <Stack.Screen name="SwapScreen" component={SwapScreen} />
      <Stack.Screen name="StakingPools" component={StakingPoolsScreen} />
      <Stack.Screen name="KosmosScreen" component={KosmosScreen} />
      <Stack.Screen name="Bridge" component={Bridge} />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default ProductsStack;
