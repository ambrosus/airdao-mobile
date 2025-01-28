import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import {
  ProcessStake,
  StakeHarborScreen,
  WithdrawHarborScreen,
  WithdrawHarborPoolScreen,
  WithdrawRequests,
  StakeHBRScreen,
  StakeAMBScreen
} from '@screens/Harbor';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const HarborStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="StakeHarborScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StakeHarborScreen" component={StakeHarborScreen} />
      <Stack.Screen name="ProcessStake" component={ProcessStake} />
      <Stack.Screen
        name="WithdrawHarborScreen"
        component={WithdrawHarborScreen}
      />
      <Stack.Screen
        name="WithdrawHarborPoolScreen"
        component={WithdrawHarborPoolScreen}
      />
      <Stack.Screen name="WithdrawRequests" component={WithdrawRequests} />
      <Stack.Screen name="StakeHBRScreen" component={StakeHBRScreen} />
      <Stack.Screen name="StakeAMBScreen" component={StakeAMBScreen} />
    </Stack.Navigator>
  );
};
