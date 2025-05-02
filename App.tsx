import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toast } from '@components/modular';
import { useAppInit } from '@hooks/useAppInit';
import { initSentryClient, withSentryProvider } from '@lib';
import Navigation from '@navigation/NavigationContainer';
import { Providers } from './Providers';

initSentryClient();

function App() {
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

export default withSentryProvider(App);
