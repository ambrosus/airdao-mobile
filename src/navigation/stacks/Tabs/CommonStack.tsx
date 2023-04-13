import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonStackParamsList } from '@appTypes/navigation/common';
import { AddressDetails } from '@screens/Address';

const Stack = createNativeStackNavigator<CommonStackParamsList>();

export const CommonStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Address"
    >
      <Stack.Screen name="Address" component={AddressDetails} />
    </Stack.Navigator>
  );
};

export default CommonStack;
