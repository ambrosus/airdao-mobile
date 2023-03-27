import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListsScreen } from '@screens/Lists';

export type ExploresParamsList = {
  ListsScreen: undefined;
};

const Stack = createNativeStackNavigator<ExploresParamsList>();
export const ListsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ListsScreen">
      <Stack.Screen name="ListsScreen" component={ListsScreen} />
    </Stack.Navigator>
  );
};

export default ListsStack;
