import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletsScreen } from '@screens/Wallets';
import { AMBMarket } from '@screens/AMBMarket';
import { WalletsParamsList } from '@appTypes/navigation/wallets';
import { Notifications } from '@screens/Notifications';
import { NavigationUtils } from '@utils/navigation';

const Stack = createNativeStackNavigator<WalletsParamsList>();
export const WalletsStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="WalletsScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WalletsScreen" component={WalletsScreen} />
      <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
      <Stack.Screen name="Notifications" component={Notifications} />
      {NavigationUtils.getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default WalletsStack;
