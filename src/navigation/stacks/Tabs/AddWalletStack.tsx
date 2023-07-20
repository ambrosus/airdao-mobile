import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddWalletStackParamsList } from '@appTypes';
import { AddWalletScreen } from '@screens/AddWallet';
import { CreateWalletStep1, CreateWalletStep2 } from '@screens/CreateWallet';
import { RestoreWalletScreen } from '@screens/RestoreWallet';

const Stack = createNativeStackNavigator<AddWalletStackParamsList>();
export const AddWalletStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AddWalletScreen"
    >
      <Stack.Screen name="AddWalletScreen" component={AddWalletScreen} />
      <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
      <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
      <Stack.Screen
        name="RestoreWalletScreen"
        component={RestoreWalletScreen}
      />
    </Stack.Navigator>
  );
};

export default AddWalletStack;
