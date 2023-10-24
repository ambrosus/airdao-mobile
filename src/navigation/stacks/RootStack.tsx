import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabsNavigator } from './TabsNavigator';
import AppInitialization from './AppInit';
import { RootStackParamsList } from '@appTypes';
import { NoWalletScreen } from '@screens/NoWallet';
import { PasscodeEntry } from '@screens/PasscodeEntry';

export const RootStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamsList>();
  return (
    <Stack.Navigator
      initialRouteName="AppInit"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="AppInit"
        component={AppInitialization}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={NoWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="Passcode"
        component={PasscodeEntry}
        options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
