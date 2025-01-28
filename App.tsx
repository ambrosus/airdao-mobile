import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '@components/modular';
import { useAppInit } from '@hooks/useAppInit';
import Navigation from '@navigation/NavigationContainer';
import { Providers } from './Providers';

export default function App() {
  const { isAppReady } = useAppInit();
  if (!isAppReady) {
    return null;
  }

  return (
    // @ts-ignore
    <Providers>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
        <Toast />
      </GestureHandlerRootView>
    </Providers>
  );
}
