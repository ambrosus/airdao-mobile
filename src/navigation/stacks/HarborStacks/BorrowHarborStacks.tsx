import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HarborTabParamsList } from '@appTypes/navigation/harbor';
import { BorrowHarborScreen } from '@features/harbor';

const Stack = createNativeStackNavigator<HarborTabParamsList>();
export const BorrowHarborStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="BorrowHarborScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BorrowHarborScreen" component={BorrowHarborScreen} />
    </Stack.Navigator>
  );
};
