import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '@appTypes';
import { Cache, CacheKey } from '@utils/cache';
import * as ExpoSecureStore from 'expo-secure-store';
// here we will check if user has token
const AppInitialization = () => {
  const navigation = useNavigation<RootNavigationProp>();

  // uncomment to clear IsFirstInit Cache key
  // Cache.setItem(CacheKey.IsFirstInit, []);

  useEffect(() => {
    (async () => {
      try {
        const migratedCache = await ExpoSecureStore.getItemAsync(
          CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE
        );
        await Cache.deleteAll();
        if (!migratedCache) {
          await Cache.setItem(CacheKey.DEV_ONLY_MIGRATED_SECURE_STORE, true);
        }
        const value = await Cache.getItem(CacheKey.IsSecondInit);
        if (!value) {
          return navigation.navigate('WelcomeScreen');
        } else {
          return navigation.navigate('Tabs', { screen: 'Wallets' });
        }
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
