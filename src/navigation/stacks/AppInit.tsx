import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from '@appTypes';
import * as SplashScreen from 'expo-splash-screen';

// here we will check if user has token
const AppInitialization = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TabsParamsList>>();

  useEffect(() => {
    return navigation.navigate('Tabs', { screen: 'Wallets' });
  }, [navigation]);

  setTimeout(() => {
    SplashScreen.hideAsync();
  }, 100);

  return null;
};

export default AppInitialization;
