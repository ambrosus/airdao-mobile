import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TabsNavigator } from './TabsNavigator';
import AppInitialization from './AppInit';
import { SingleAddressGroupScreen } from '@screens/Lists/screens/SingleAddressGroupScreen';
import { AccountList } from '@models/AccountList';

export type RootStackParamsList = {
  AppInit: undefined;
  Tabs: undefined;
  SingleAddressGroup: { group: AccountList };
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
        name="SingleAddressGroup"
        component={SingleAddressGroupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
