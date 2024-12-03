import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { StakeHarborScreen } from '../../../screens/Harbor';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const HarborStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="StakeHarborScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StakeHarborScreen" component={StakeHarborScreen} />
    </Stack.Navigator>
  );
};
