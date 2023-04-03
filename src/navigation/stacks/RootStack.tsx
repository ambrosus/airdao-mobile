import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TabsNavigator } from './TabsNavigator';
import AppInitialization from './AppInit';
import { SingleListScreen } from '@screens/Lists/screens/SIngleListScreen';
import { WalletGroup } from '@screens/Lists/components/ListsOfWallets';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: undefined;
  SingleListScreen: { item: WalletGroup };
};

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
        name="Tabs"
        component={TabsNavigator}
        // options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleListScreen"
        component={SingleListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
