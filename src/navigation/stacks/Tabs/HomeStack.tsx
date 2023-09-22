import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Wallets';
import { AMBMarket } from '@screens/AMBMarket';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { Notifications } from '@screens/Notifications';
import { getCommonStack } from '../CommonStack';
import { AssetScreen } from '@screens/Asset';
import { SendFunds } from '@screens/SendFunds';
import {
  CreateWalletStep0,
  CreateWalletStep1,
  CreateWalletStep2
} from '@screens/CreateWallet';
import { RestoreWalletScreen } from '@screens/RestoreWallet';
import {
  ConfirmPasscode,
  SetupPasscode,
  SuccessBackupComplete,
  SuccessSetupSecurity
} from '@screens/CreateWallet/components';
import { SendCryptoProvider } from '@contexts';
import { SuccessImport } from '@screens/CreateWallet/components/SuccessImport';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    // @ts-ignore
    <SendCryptoProvider>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="AssetScreen" component={AssetScreen} />
        <Stack.Screen name="SendFunds" component={SendFunds} />
        <Stack.Screen name="CreateWalletStep0" component={CreateWalletStep0} />
        <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
        <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
        <Stack.Screen name="SetupPasscode" component={SetupPasscode} />
        <Stack.Screen name="ConfirmPasscode" component={ConfirmPasscode} />
        <Stack.Screen
          name="SuccessSetupSecurity"
          component={SuccessSetupSecurity}
        />
        <Stack.Screen
          name="SuccessBackupComplete"
          component={SuccessBackupComplete}
        />
        <Stack.Screen name="SuccessImport" component={SuccessImport} />
        <Stack.Screen
          name="RestoreWalletScreen"
          component={RestoreWalletScreen}
        />
        {getCommonStack(Stack as any)}
      </Stack.Navigator>
    </SendCryptoProvider>
  );
};

export default HomeStack;
