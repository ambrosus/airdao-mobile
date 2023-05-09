import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListsScreen } from '@screens/Lists';
import { ListsParamsLists } from '@appTypes/navigation/lists';
import { NavigationUtils } from '@utils/navigation';
import { SingleAddressGroupScreen } from '@screens/List';

const Stack = createNativeStackNavigator<ListsParamsLists>();
export const ListsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ListsScreen"
    >
      <Stack.Screen
        name="ListsScreen"
        component={ListsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleAddressGroup"
        component={SingleAddressGroupScreen}
        options={{ headerShown: false }}
      />
      {NavigationUtils.getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default ListsStack;
