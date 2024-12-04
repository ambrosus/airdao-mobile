import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { StakeHarborScreen, WithdrawHarborScreen } from '@screens/Harbor';
import { WithdrawRequests } from '@screens/Harbor/WithdrawRequests/WithdrawRequests';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const HarborStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="StakeHarborScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StakeHarborScreen" component={StakeHarborScreen} />
      <Stack.Screen
        name="WithdrawHarborScreen"
        component={WithdrawHarborScreen}
      />
      <Stack.Screen name="WithdrawRequests" component={WithdrawRequests} />
    </Stack.Navigator>
  );
};
