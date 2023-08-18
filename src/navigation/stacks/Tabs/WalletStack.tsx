import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletStackParamsList } from '@appTypes';
import { WalletScreen } from '@screens/Wallet';
import {
  CreateWalletStep1,
  CreateWalletStep2,
  CreateWalletStep0
} from '@screens/Wallet/CreateWallet';
import { RestoreWalletScreen } from '@screens/Wallet/RestoreWallet';
import { getCommonStack } from '@navigation/stacks/CommonStack';
import { WalletAccount } from '@screens/Wallet/Account';
import { ReceiptScreen } from '@screens/Wallet/Receipt';
import { SendCryptoProvider } from '@contexts/SendCrypto/SendCrypto.context';
import { SuccessBackupComplete } from '@screens/Wallet/CreateWallet/components/SuccessBackupComplete';

const Stack = createNativeStackNavigator<WalletStackParamsList>();
export const WalletStack = () => {
  return (
    <SendCryptoProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="WalletScreen"
      >
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
        <Stack.Screen name="WalletAccount" component={WalletAccount} />
        <Stack.Screen name="CreateWalletStep0" component={CreateWalletStep0} />
        <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
        <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
        <Stack.Screen
          name="SuccessBackupComplete"
          component={SuccessBackupComplete}
        />
        <Stack.Screen
          name="RestoreWalletScreen"
          component={RestoreWalletScreen}
        />
        {getCommonStack(Stack as any)}
      </Stack.Navigator>
    </SendCryptoProvider>
  );
};

export default WalletStack;
