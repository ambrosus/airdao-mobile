import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { StakeAMBScreen } from '@features/harbor';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const StakeAMBStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="StakeAMB"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StakeAMB" component={StakeAMBScreen} />
    </Stack.Navigator>
  );
};
