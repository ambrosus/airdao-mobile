import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExploreScreen } from '@screens/Explore';

export type ExploresParamsList = {
  ExploreScreen: undefined;
};

const Stack = createNativeStackNavigator<ExploresParamsList>();
export const ExploreStack = () => {
  return (
    <Stack.Navigator initialRouteName="ExploreScreen">
      <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
    </Stack.Navigator>
  );
};

export default ExploreStack;
