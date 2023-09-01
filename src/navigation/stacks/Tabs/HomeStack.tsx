import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Wallets/WalletsNew';
import { AMBMarket } from '@screens/AMBMarket';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { Notifications } from '@screens/Notifications';
import { getCommonStack } from '../CommonStack';
import { SendFunds } from '@screens/SendFunds';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="SendFunds" component={SendFunds} />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default HomeStack;
