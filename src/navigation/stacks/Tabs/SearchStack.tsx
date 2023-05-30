import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '@screens/Search';
import { SearchTabParamsList } from '@appTypes/navigation';
import { NavigationUtils } from '@utils/navigation';

const Stack = createNativeStackNavigator<SearchTabParamsList>();
export const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SearchScreen"
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      {NavigationUtils.getCommonStack(Stack as any)}
    </Stack.Navigator>
  );
};

export default SearchStack;
