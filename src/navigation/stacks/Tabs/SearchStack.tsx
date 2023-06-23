import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '@screens/Search';
import { SearchTabParamsList } from '@appTypes/navigation';
import { getCommonStack } from '../CommonStack';

const Stack = createNativeStackNavigator<SearchTabParamsList>();
export const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SearchScreen"
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      {getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default SearchStack;
