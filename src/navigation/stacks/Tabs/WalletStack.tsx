import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddressStackParamsList } from '@appTypes';
import { WalletScreen } from '@screens/WalletScreen';
import { CreateWalletStep1, CreateWalletStep2 } from '@screens/CreateWallet';
import { RestoreWalletScreen } from '@screens/RestoreWallet';
import { getCommonStack } from '@navigation/stacks/CommonStack';

const Stack = createNativeStackNavigator<AddressStackParamsList>();
export const WalletStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="WalletScreen"
    >
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
      <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
      <Stack.Screen
        name="RestoreWalletScreen"
        component={RestoreWalletScreen}
      />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default WalletStack;
