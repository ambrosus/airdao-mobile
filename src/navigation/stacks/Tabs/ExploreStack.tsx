import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExploreScreen } from '@screens/Explore';
import { ExploreTabParamsList } from '@appTypes/navigation';

const Stack = createNativeStackNavigator<ExploreTabParamsList>();
export const ExploreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ExploreScreen"
    >
      <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
    </Stack.Navigator>
  );
};

export default ExploreStack;
