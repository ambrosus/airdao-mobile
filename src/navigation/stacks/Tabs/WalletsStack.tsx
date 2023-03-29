import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletsScreen } from '@screens/Wallets';

export type WalletsParamsList = {
  WalletsScreen: undefined;
};

const Stack = createNativeStackNavigator<WalletsParamsList>();
export const WalletsStack = () => {
  return (
    <Stack.Navigator initialRouteName="WalletsScreen">
      <Stack.Screen
        name="WalletsScreen"
        component={WalletsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default WalletsStack;
