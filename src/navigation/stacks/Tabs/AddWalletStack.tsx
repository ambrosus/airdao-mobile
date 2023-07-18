import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '@screens/Settings';
import { AddWalletStackParamsList } from '@appTypes';
import { AddWalletScreen } from '@screens/AddWallet';
import { CreateWalletScreen } from '@screens/CreateWallet';

const Stack = createNativeStackNavigator<AddWalletStackParamsList>();
export const AddWalletStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AddWalletScreen"
    >
      <Stack.Screen name="AddWalletScreen" component={AddWalletScreen} />
      <Stack.Screen name="CreateWalletScreen" component={CreateWalletScreen} />
      <Stack.Screen name="RestoreWalletScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AddWalletStack;
