import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PortfolioScreen } from '@screens/Portfolio';
import { PortfolioParamsPortfolio } from '@appTypes';
import { getCommonStack } from '../CommonStack';

const Stack = createNativeStackNavigator<PortfolioParamsPortfolio>();
export const PortfolioStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="PortfolioScreen"
    >
      <Stack.Screen
        name="PortfolioScreen"
        component={PortfolioScreen}
        options={{ headerShown: false }}
      />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default PortfolioStack;
