import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@screens/Wallets/WalletsNew';
import { AMBMarket } from '@screens/AMBMarket';
import { HomeParamsList } from '@appTypes/navigation/wallets';
import { Notifications } from '@screens/Notifications';
import { getCommonStack } from '../CommonStack';
import { AssetScreen } from '@screens/Asset';
import { SendFunds } from '@screens/SendFunds';
import { WalletScreen } from '@screens/Wallet';
import { ReceiptScreen } from '@screens/Wallet/Receipt';
import { WalletAccount } from '@screens/Wallet/Account';
import {
  CreateWalletStep0,
  CreateWalletStep1,
  CreateWalletStep2
} from '@screens/Wallet/CreateWallet';
import { RestoreWalletScreen } from '@screens/Wallet/RestoreWallet';
import { SuccessBackupComplete } from '@screens/Wallet/CreateWallet/components';
import { SendCryptoProvider } from '@contexts/SendCrypto/SendCrypto.context';
import { NoWalletScreen } from '@screens/NoWallet';

const Stack = createNativeStackNavigator<HomeParamsList>();
export const HomeStack = () => {
  return (
    // @ts-ignore
    <SendCryptoProvider>
      <Stack.Navigator
        initialRouteName="NoWallet"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AMBMarketScreen" component={AMBMarket} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="AssetScreen" component={AssetScreen} />
        <Stack.Screen name="SendFunds" component={SendFunds} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
        <Stack.Screen name="WalletAccount" component={WalletAccount} />
        <Stack.Screen name="CreateWalletStep0" component={CreateWalletStep0} />
        <Stack.Screen name="CreateWalletStep1" component={CreateWalletStep1} />
        <Stack.Screen name="CreateWalletStep2" component={CreateWalletStep2} />
        <Stack.Screen name="NoWallet" component={NoWalletScreen} />
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

export default HomeStack;
