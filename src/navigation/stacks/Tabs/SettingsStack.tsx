import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '@screens/Settings';
import { SettingsTabParamsList } from '@appTypes';
import AddWalletStack from './AddWalletStack';

const Stack = createNativeStackNavigator<SettingsTabParamsList>();
export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SettingsScreen"
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="AddWalletStack" component={AddWalletStack} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
