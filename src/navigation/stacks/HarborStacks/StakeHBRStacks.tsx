import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { StakeHBRScreen } from '@features/harbor';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const StakeHBRStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="StakeHBR"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StakeHBR" component={StakeHBRScreen} />
    </Stack.Navigator>
  );
};
