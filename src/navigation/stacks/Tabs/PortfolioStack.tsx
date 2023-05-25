import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PortfolioScreen } from '@screens/Portfolio';
import { NavigationUtils } from '@utils/navigation';
import { SingleGroupScreen } from '@screens/SingleCollection';
import { PortfolioParamsPortfolio } from '@appTypes';

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
      <Stack.Screen
        name="SingleGroup"
        component={SingleGroupScreen}
        options={{ headerShown: false }}
      />
      {NavigationUtils.getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default PortfolioStack;
