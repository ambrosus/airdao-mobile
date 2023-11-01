import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AboutScreen,
  AppPreferencesScreen,
  HelpCenterScreen,
  NotificationSettingsScreen,
  SecuritySettingsScreen,
  SettingsScreen,
  ManageWalletsScreen,
  SingleWalletScreen,
  ChangePasscode
} from '@screens/Settings';
import { SettingsTabParamsList } from '@appTypes';

const Stack = createNativeStackNavigator<SettingsTabParamsList>();
export const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SettingsScreen"
    >
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="AppPreferences" component={AppPreferencesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ManageWallets" component={ManageWalletsScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
      />
      <Stack.Screen name="ChangePasscode" component={ChangePasscode} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="SingleWallet" component={SingleWalletScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
