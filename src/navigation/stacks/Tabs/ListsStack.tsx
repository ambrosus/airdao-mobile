import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListsScreen } from '@screens/Lists';
import { ListsParamsLists } from '@appTypes/navigation/lists';

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
    </Stack.Navigator>
  );
};

export default ListsStack;
