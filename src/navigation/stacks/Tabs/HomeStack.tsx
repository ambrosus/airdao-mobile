import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Wallets/WalletsNew';
import { AMBMarket } from '@screens/AMBMarket';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { Notifications } from '@screens/Notifications';
import { getCommonStack } from '../CommonStack';
import { AssetScreen } from '@screens/Asset';
import { SendFunds } from '@screens/SendFunds';
import { NoWalletScreen } from '@screens/NoWallet';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="NoWallet"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="AssetScreen" component={AssetScreen} />
      <Stack.Screen name="SendFunds" component={SendFunds} />
      <Stack.Screen name="NoWallet" component={NoWalletScreen} />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default HomeStack;
