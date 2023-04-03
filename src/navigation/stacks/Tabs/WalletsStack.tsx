import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletsScreen } from '@screens/Wallets';
import { AMBMarket } from '@screens/AMBMarket';
import { WalletsParamsList } from '@appTypes/navigation/wallets';

const Stack = createNativeStackNavigator<WalletsParamsList>();
export const WalletsStack = () => {
  return (
    <Stack.Navigator initialRouteName="WalletsScreen">
      <Stack.Screen
        name="WalletsScreen"
        component={WalletsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AMBMarketScreen"
        component={AMBMarket}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default WalletsStack;
