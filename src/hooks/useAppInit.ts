import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
/* eslint camelcase: 0 */
export const useAppInit = () => {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Inter_500Medium: require('../../assets/fonts/Inter-Medium.ttf'),
          Inter_600SemiBold: require('../../assets/fonts/Inter-SemiBold.ttf'),
          Inter_700Bold: require('../../assets/fonts/Inter-Bold.ttf'),
          Mersad_600SemiBold: require('../../assets/fonts/Mersad-SemiBold.ttf')
        });
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  return { isAppReady };
};
