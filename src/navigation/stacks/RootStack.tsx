import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@appTypes';
import { useCurrenciesQuery } from '@entities/currencies/lib';
import { BarcodeScannerScreen } from '@screens/BarcodeScanner';
import { NoWalletScreen } from '@screens/NoWallet';
import { PasscodeEntry } from '@screens/PasscodeEntry';
import AppInitialization from './AppInit';
import { TabsNavigator } from './TabsNavigator';

export const RootStack = () => {
  useCurrenciesQuery();

  const Stack = createNativeStackNavigator<RootStackParamsList>();

  return (
    <Stack.Navigator
      initialRouteName="AppInit"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="AppInit"
        component={AppInitialization}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={NoWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="Passcode"
        component={PasscodeEntry}
        options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
      />
      <Stack.Screen
        name="BarcodeScannerScreen"
        initialParams={{ walletConnectEnabled: false }}
        options={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom'
        }}
        component={BarcodeScannerScreen}
      />
    </Stack.Navigator>
  );
};
