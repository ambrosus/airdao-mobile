import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabsParamsList } from '@appTypes';
import * as SplashScreen from 'expo-splash-screen';
import { Cache, CacheKey } from '@utils/cache';
import { RootStackParamsList } from '@navigation/stacks/RootStack';

// here we will check if user has token
const AppInitialization = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<TabsParamsList | RootStackParamsList>
    >();

  useEffect(() => {
    (async () => {
      try {
        const value = await Cache.getItem(CacheKey.IsFirstInit);
        if (!value) {
          return navigation.navigate('WelcomeScreen');
        }
        return navigation.navigate('Tabs', { screen: 'Wallets' });
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error('Error retrieving data:', error);
      }
    })();
  }, [navigation]);

  setTimeout(() => {
    SplashScreen.hideAsync();
  }, 100);

  return null;
};

export default AppInitialization;
